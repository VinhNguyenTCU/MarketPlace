import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("SUPABASE_URL is required");
if (!anonKey) throw new Error("SUPABASE_ANON_KEY is required");

// Optional: remove these logs in real code (they can leak secrets in some setups)
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", anonKey ? "set" : "not set");
console.log("Supabase Service Role Key:", serviceRoleKey ? "set" : "not set");

/**
 * Base client (public/anon) — no user Authorization header.
 * Use this only for:
 * - public tables
 * - auth methods that don't need a user token
 * - anything where you don't need to impersonate a logged-in user
 */
export const getSupabaseAnonClient = () => createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Supabase client scoped to a user via their access token.
 * Use this for any requests that need to be made on behalf of a logged-in user.
 */
export const getSupabaseUserClient = (accessToken: string) => {
  if (!accessToken) throw new Error("accessToken is required for user-scoped client");

  return createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

// ------------------- Admin client (singleton) -------------------

let supabaseAdminClient: SupabaseClient | undefined;

export const getSupabaseAdminClient = () => {
  if (supabaseAdminClient) return supabaseAdminClient;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin client");
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabaseAdminClient;
};
