import { getSupabaseUserClient } from "../supabase/client.js";

export class ProfileRepository {

  private asUser(accessToken: string) {
    return getSupabaseUserClient(accessToken);
  }

  async getMe(accessToken: string) {
    const supabase = this.asUser(accessToken);
    return supabase.from("profiles").select("*").single();
  }
}