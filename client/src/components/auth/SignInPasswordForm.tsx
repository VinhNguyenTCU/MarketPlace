import { useState } from "react";
import type { AuthViewState } from "../../auth/types";
import { useAuth } from "../../hooks/useAuth";

export function SignInPasswordForm() {
  const { signInWithPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, setState] = useState<AuthViewState>({ status: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading", message: "Signing in..." });

    try {
      await signInWithPassword({ email, password });
      setState({ status: "success", message: "Signed in successfully." });
    } catch (err: any) {
      setState({ status: "error", message: err.message ?? "Failed to sign in." });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="you@example.com"
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
      />

      <label>Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="••••••••"
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
      />

      <button style={{ width: "100%", padding: 10 }} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Signing in..." : "Sign in"}
      </button>

      <StatusLine state={state} />
    </form>
  );
}

function StatusLine({ state }: { state: AuthViewState }) {
  if (state.status === "idle") return null;
  const text = state.message ?? "";
  return <p style={{ marginTop: 12 }}>{text}</p>;
}
