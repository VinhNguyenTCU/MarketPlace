import { createClient } from "@supabase/supabase-js";

export class ProfileRepository {
  private url = process.env.SUPABASE_URL!;
  private anonKey = process.env.SUPABASE_ANON_KEY!;

  private asUser(accessToken: string) {
    return createClient(this.url, this.anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async getMe(accessToken: string) {
    const supabase = this.asUser(accessToken);
    return supabase.from("profiles").select("*").single();
  }
}