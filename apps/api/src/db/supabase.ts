import { createClient } from "@supabase/supabase-js";
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!url || !key) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(url, key);
