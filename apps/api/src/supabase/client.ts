import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", anonKey ? anonKey : "not set");
console.log("Supabase Service Role Key:", serviceRoleKey ? serviceRoleKey : "not set");

// Client used when you want RLS enforced (recommended for user-scoped DB ops)
export const supabaseAnon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

// Client used for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
})