// assets/js/core/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


export const SUPABASE_URL = "https://zvnmahaebrxjegwzjxol.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_Zrg00fbAp2YRw4f_WV4Gxw_3sgyajlS";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});