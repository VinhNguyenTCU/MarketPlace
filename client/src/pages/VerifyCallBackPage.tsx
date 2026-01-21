import { useEffect, useState } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { verifyFromUrlParams } from "../services/authService";

type VerifyState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function VerifyCallbackPage() {
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    verifyFromUrlParams().then((res) => {
      if (res.ok) setState({ status: "success" });
      else setState({ status: "error", message: res.message });
    });
  }, []);

  if (state.status === "loading") {
    return (
      <AuthShell title="Verifying..." subtitle="Confirming your login">
        <p>Loading...</p>
      </AuthShell>
    );
  }

  if (state.status === "error") {
    return (
      <AuthShell title="Verification failed" subtitle="Something went wrong">
        <p>{state.message}</p>
        <p>Go back to the login page and try again.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Verified" subtitle="You are now authenticated">
      <p>You can redirect to your main app page here.</p>
    </AuthShell>
  );
}
