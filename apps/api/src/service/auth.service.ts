import { getSupabaseAnonClient } from "../supabase/client.js";
import { UserRepository } from "../repository/user.repository.js";

export class AuthService {
  async signup(email: string, password: string, fullName: string) {
    if (!fullName || !fullName.trim()) {
        return { ok: false as const, status: 400, error: "fullName required" };
      }
    
    const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) {
        return { ok: false as const, status: 500, error: "FRONTEND_URL is not configured" };
      }
    
    const { data, error } = await getSupabaseAnonClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${frontendUrl}/sign-in`,
        data: {
          full_name: fullName.trim(),
        },
      },
    });
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

  async resetlink(email : string) {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      return { ok: false as const, status: 500, error: "FRONTEND_URL is not configured" };
    }

    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      return { ok: false as const, status: 404, error: "No account found with that email" };
    }

    const {error} = await getSupabaseAnonClient().auth.resetPasswordForEmail(
      email,
      {redirectTo: `${frontendUrl}/change-password`}
    );
    if(error) return { ok: false as const, status: 400, error: error.message, };
    return {
      ok: true as const,
      data: {
        message: "Password reset email sent. Please check your email"
      },
    };
  }

  /*async updatepassword(newPassword : string, confirmPassword: string) {
    if(newPassword != confirmPassword) {
      return {ok:false as const, status:400, error: "Passwords don't match"};
    }
    if(newPassword.length < 6) {
      return {ok:false as const, status:400, error: "Password needs to be at least 6 characters"};
    }
    
    const {error} = await getSupabaseAnonClient().auth.updateUser({
      password : newPassword,
    });
    if(error) return {
      ok: false as const,
      status:400,
      error: error.message,
    };
    return {
      ok:true as const,
      data : {
        message: "Password updated succesfully", 
      }
    };
  }*/
}
