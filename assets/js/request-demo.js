// assets/js/request-demo.js
import { supabase } from "./core/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cta-form");
    if (!form) return;

    const input = document.querySelector("#ctaEmail");
    const hint = document.querySelector("#ctaHint");
    const btn = document.querySelector("#ctaBtn");

    const setHint = (text, ok = false) => {
        if (!hint) return;
        hint.textContent = text;
        hint.style.color = ok ? "#0f766e" : "#b91c1c";
    };

    // Simple toast (no extra HTML needed)
    const toast = (() => {
        let el = document.getElementById("ps-toast");
        if (!el) {
            el = document.createElement("div");
            el.id = "ps-toast";
            el.setAttribute("role", "status");
            el.setAttribute("aria-live", "polite");
            el.style.position = "fixed";
            el.style.left = "50%";
            el.style.bottom = "18px";
            el.style.transform = "translateX(-50%) translateY(10px)";
            el.style.padding = "10px 14px";
            el.style.borderRadius = "12px";
            el.style.border = "1px solid rgba(11,31,59,.12)";
            el.style.background = "rgba(255,255,255,.92)";
            el.style.boxShadow = "0 18px 40px rgba(11,31,59,.12)";
            el.style.color = "#0B1F3B";
            el.style.fontWeight = "900";
            el.style.fontSize = "13px";
            el.style.opacity = "0";
            el.style.transition = "opacity .2s ease, transform .2s ease";
            el.style.zIndex = "9999";
            el.style.backdropFilter = "blur(10px)";
            document.body.appendChild(el);
        }

        let t = null;

        return (message, ok = true) => {
            el.textContent = message;
            el.style.borderColor = ok ? "rgba(0,166,166,.35)" : "rgba(185,28,28,.35)";
            el.style.color = ok ? "#0f766e" : "#b91c1c";

            // show
            el.style.opacity = "1";
            el.style.transform = "translateX(-50%) translateY(0)";

            // hide after 2.4s
            clearTimeout(t);
            t = setTimeout(() => {
                el.style.opacity = "0";
                el.style.transform = "translateX(-50%) translateY(10px)";
            }, 2400);
        };
    })();

    // ✅ Only allow emails like: name@gmail.com
    const isValidGmail = (email) => {
        // must have something before @, must end with @gmail.com, no spaces
        return /^[^\s@]+@gmail\.com$/i.test(email);
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = (input?.value || "").trim().toLowerCase();

        if (!email) {
            setHint("Please enter your email.", false);
            toast("Please enter your email.", false);
            input?.focus();
            return;
        }

        if (!isValidGmail(email)) {
            setHint("Use a Gmail address (example: name@gmail.com).", false);
            toast("Invalid email. Please use name@gmail.com", false);
            input?.focus();
            return;
        }

        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = "Sending…";
        setHint("Submitting…", true);

        const { error } = await supabase.from("demo_requests").insert([{ email }]);

        if (error) {
            console.error("[demo_requests insert error]", error);
            setHint("Failed to send. Try again.", false);
            toast("Failed to send. Try again.", false);

            btn.disabled = false;
            btn.textContent = oldText;
            return;
        }

        setHint("Success — we’ll contact you soon.", true);
        toast("✅ Sent! We’ll contact you soon.", true);
        form.reset();

        btn.disabled = false;
        btn.textContent = oldText;
    });
});