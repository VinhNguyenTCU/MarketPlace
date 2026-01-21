import { createContext, useEffect, useMemo, useState } from "react";
import type { AuthContextValue } from "./types";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import * as authService from "../services/authService";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setInitializing(false);
      })
      .finally(() => {
        if (!mounted) return;
        setInitializing(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      user,
      initializing,

      signInWithPassword: authService.signInWithPassword,
      signUpWithPassword: authService.signUpWithPassword,
      signOut: authService.signOut,
    };
  }, [session, user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
