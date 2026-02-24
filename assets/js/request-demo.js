// assets/js/request-demo.js
import { supabase } from "./core/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".cta-form");
    if (!form) return;

    // Required
    const emailInput = document.getElementById("ctaEmail");
    const feedbackInput = document.getElementById("ctaFeedback");

    // Optional
    const nameInput = document.getElementById("ctaName");
    const orgInput = document.getElementById("ctaOrg");

    const hint = document.getElementById("ctaHint");
    const btn = document.getElementById("ctaBtn");

    // --- UI helpers ---
    const setHint = (text, ok = false) => {
        if (!hint) return;
        hint.textContent = text;
        hint.style.color = ok ? "#0f766e" : "#b91c1c";
    };

    // Minimal toast (no extra HTML needed)
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
            el.style.background = "rgba(255,255,255,.95)";
            el.style.boxShadow = "0 18px 40px rgba(11,31,59,.12)";
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

            el.style.opacity = "1";
            el.style.transform = "translateX(-50%) translateY(0)";

            clearTimeout(t);
            t = setTimeout(() => {
                el.style.opacity = "0";
                el.style.transform = "translateX(-50%) translateY(10px)";
            }, 2600);
        };
    })();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const setLoading = (loading) => {
        if (!btn) return;
        btn.disabled = loading;
        btn.textContent = loading ? "Sending…" : "Get in touch";
    };

    // --- Submit ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = (emailInput?.value || "").trim().toLowerCase();
        const feedback = (feedbackInput?.value || "").trim();
        const name = (nameInput?.value || "").trim();
        const organization = (orgInput?.value || "").trim();

        if (!email) {
            setHint("Please enter your email.", false);
            toast("Please enter your email.", false);
            emailInput?.focus();
            return;
        }

        if (!isValidEmail(email)) {
            setHint("Please enter a valid email address.", false);
            toast("Invalid email address.", false);
            emailInput?.focus();
            return;
        }

        if (!feedback || feedback.length < 10) {
            setHint("Please add a short message (min 10 characters).", false);
            toast("Feedback is required.", false);
            feedbackInput?.focus();
            return;
        }

        setLoading(true);
        setHint("Submitting…", true);

        try {
            const payload = {
                email,
                feedback,
                name: name || null,
                organization: organization || null,
                source: "marketing"
            };

            const { error } = await supabase.from("demo_requests").insert([payload]);
            if (error) throw error;

            setHint("Success — we’ll contact you soon.", true);
            toast("✅ Sent! We’ll contact you soon.", true);
            form.reset();
        } catch (err) {
            console.error("[demo_requests insert error]", err);
            setHint("Failed to send. Try again.", false);

            // Supabase errors often have .message
            const msg = err?.message ? `Failed: ${err.message}` : "Failed to send. Try again.";
            toast(msg, false);
        } finally {
            setLoading(false);
        }
    });
});