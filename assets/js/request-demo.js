// assets/js/request-demo.js
import { supabase } from "./core/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cta-form");
    if (!form) return;

    const input = document.querySelector("#ctaEmail");
    const hint = document.querySelector("#ctaHint");
    const btn = document.querySelector("#ctaBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = (input.value || "").trim().toLowerCase();
        if (!email) {
            hint.textContent = "Please enter your email.";
            hint.style.color = "#b91c1c";
            return;
        }

        btn.disabled = true;

        const { error } = await supabase.from("demo_requests").insert([{ email }]);

        if (error) {
            console.error(error);
            hint.textContent = "Failed to send. Try again.";
            hint.style.color = "#b91c1c";
        } else {
            hint.textContent = "Success — we’ll contact you soon.";
            hint.style.color = "#0f766e";
            form.reset();
        }

        btn.disabled = false;
    });
});