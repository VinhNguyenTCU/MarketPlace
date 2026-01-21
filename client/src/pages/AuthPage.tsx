import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthMode } from "../auth/types";
import { AuthShell } from "../components/auth/AuthShell";
import { SignInPasswordForm } from "../components/auth/SignInPasswordForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const navigate = useNavigate();
  const { session, initializing } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin_password");

  // Redirect if user is authenticated
  useEffect(() => {
    if (!initializing && session) {
      navigate("/", { replace: true });
    }
  }, [session, initializing, navigate]);

  if (initializing) {
    return (
      <AuthShell title="Loading..." subtitle="Checking session">
        <p>Please wait...</p>
      </AuthShell>
    );
  }

  if (session) {
    return (
      <AuthShell title="You are signed in" subtitle={session.user.email ?? ""}>
        <p>Redirect this to your main app page later.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome" subtitle="Sign in or create an account">
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("signin_password")}>
          Password Sign in
        </button>
        <button onClick={() => setMode("signup")}>Sign up</button>
      </div>

      {mode === "signin_password" && <SignInPasswordForm />}
      {mode === "signup" && <SignUpForm />}
    </AuthShell>
  );
}
