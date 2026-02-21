import { requireAuth, signOut } from "../core/auth-guard.js";
import { supabase } from "../core/supabase.js";

export async function initLayout(activeId) {
    const session = await requireAuth();
    if (!session) return;

    // active nav
    document.querySelectorAll("[data-nav]").forEach(a => {
        a.classList.toggle("active", a.dataset.nav === activeId);
    });

    // user badge
    const emailEl = document.getElementById("userEmail");
    if (emailEl) emailEl.textContent = session.user.email || "User";

    // mobile drawer
    const openBtn = document.getElementById("openDrawer");
    const drawer = document.getElementById("drawer");
    const closeBtn = document.getElementById("closeDrawer");
    const signOutBtns = document.querySelectorAll("[data-signout]");

    function openDrawer() { drawer?.classList.add("open"); }
    function closeDrawer() { drawer?.classList.remove("open"); }

    openBtn?.addEventListener("click", openDrawer);
    closeBtn?.addEventListener("click", closeDrawer);
    drawer?.addEventListener("click", (e) => {
        if (e.target === drawer) closeDrawer();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });

    signOutBtns.forEach(btn => btn.addEventListener("click", async () => {
        await signOut();
    }));

    // Optional: load full name from profiles
    const nameEl = document.getElementById("userName");
    if (nameEl) {
        const { data } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).single();
        nameEl.textContent = data?.full_name ? data.full_name : "Account";
    }
}