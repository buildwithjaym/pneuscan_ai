import { supabase } from "../core/supabase.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

function setMsg(text, ok = false) {
    msg.textContent = text;
    msg.classList.toggle("ok", ok);
    msg.classList.toggle("bad", !ok);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("Signing in…", true);

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        setMsg(error.message, false);
        return;
    }

    setMsg("Logged in. Redirecting…", true);
    window.location.href = "/app/index.html";
});