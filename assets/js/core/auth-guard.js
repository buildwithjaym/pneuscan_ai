// assets/js/core/auth-guard.js
import { supabase } from "./supabase.js";

export async function requireAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.warn(error);

    const session = data?.session;
    if (!session) {
        window.location.href = "/auth/login.html";
        return null;
    }
    return session;
}
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", userId)
        .maybeSingle();

    if (error) return null;
    return data;
}

export async function logout() {
    await supabase.auth.signOut();
}
export async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login.html";
}