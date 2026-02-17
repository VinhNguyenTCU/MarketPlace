import { getSupabaseAnonClient } from "../supabase/client.js";

export class AuthService {
  async signup(email: string, password: string) {
    const { data, error } = await getSupabaseAnonClient().auth.signUp({ email, password });
    if (error) return { ok: false as const, status: 400, error: error.message };

    return {
      ok: true as const,
      data: {
        user: data.user,
        session: data.session,
        message: data.session ? "Signed up" : "Check your email to confirm your account",
      },
    };
  }

  async signin(email: string, password: string) {
    const { data, error } = await getSupabaseAnonClient().auth.signInWithPassword({ email, password });
    if (error) return { ok: false as const, status: 401, error: error.message };

    return {
      ok: true as const,
      data: {
        user: data.user,
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    };
  }

  async refresh(refreshToken: string) {
    const { data, error } = await getSupabaseAnonClient().auth.refreshSession({ refresh_token: refreshToken });
    if (error) return { ok: false as const, status: 401, error: error.message };

    return {
      ok: true as const,
      data: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    };
  }
}