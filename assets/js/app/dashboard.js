import { initLayout } from "./layout.js";
import { supabase } from "../core/supabase.js";

function chipClass(band) {
    const b = (band || "").toLowerCase();
    if (b.includes("elev")) return "chip high";
    if (b.includes("mod")) return "chip mod";
    return "chip low";
}

function safeText(s) {
    return String(s || "").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

await initLayout("dashboard");

// get current user
const { data: sessionData } = await supabase.auth.getSession();
const userId = sessionData?.session?.user?.id;

const kpiTotal = document.getElementById("kpiTotal");
const kpiModerate = document.getElementById("kpiModerate");
const kpiElevated = document.getElementById("kpiElevated");
const recentRows = document.getElementById("recentRows");

if (!userId) {
    recentRows.innerHTML = `<tr><td colspan="4">Not logged in.</td></tr>`;
} else {
    const { data: scans, error } = await supabase
        .from("scans")
        .select("id, file_name, risk_band, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        recentRows.innerHTML = `<tr><td colspan="4">Failed to load scans.</td></tr>`;
    } else {
        const total = scans.length;
        const moderate = scans.filter(s => (s.risk_band || "").toLowerCase().includes("mod")).length;
        const elevated = scans.filter(s => (s.risk_band || "").toLowerCase().includes("elev")).length;

        kpiTotal.textContent = String(total);
        kpiModerate.textContent = String(moderate);
        kpiElevated.textContent = String(elevated);

        if (!scans.length) {
            recentRows.innerHTML = `<tr><td colspan="4" class="muted">No scans yet. Upload your first X-ray.</td></tr>`;
        } else {
            recentRows.innerHTML = scans.map(s => {
                const date = new Date(s.created_at).toLocaleDateString();
                const name = s.file_name ? safeText(s.file_name) : "X-ray";
                const band = s.risk_band || "Low";
                return `
          <tr>
            <td>${date}</td>
            <td>${name}</td>
            <td><span class="${chipClass(band)}">${safeText(band)}</span></td>
            <td><a class="btn btn-ghost" style="padding:8px 10px;font-size:13px;" href="/app/report.html?id=${encodeURIComponent(s.id)}">Open</a></td>
          </tr>
        `;
            }).join("");
        }
    }
}