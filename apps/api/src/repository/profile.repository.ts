import { getSupabaseAnon } from "../supabase/client.js";

export class ProfileRepository {

  private asUser(accessToken: string) {
    return getSupabaseAnon(accessToken);
  }

  async getMe(accessToken: string) {
    const supabase = this.asUser(accessToken);
    return supabase.from("profiles").select("*").single();
  }
}