import type { Session, User } from "@supabase/supabase-js";

export type AuthMode = "signin_password" | "signup";

export type AuthViewState =
  | { status: "idle" }
  | { status: "loading"; message?: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  initializing: boolean;

  // actions
  signInWithPassword: (args: {
    email: string;
    password: string;
  }) => Promise<void>;
  signUpWithPassword: (args: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

export type VerifyCallbackResult =
  | { ok: true }
  | { ok: false; message: string };
