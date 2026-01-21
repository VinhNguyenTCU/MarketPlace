// pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { session, initializing, signOut } = useAuth();

  if (initializing) {
    return (
      <div style={{ maxWidth: 600, margin: "48px auto", padding: 16 }}>
        <h1>Home</h1>
        <p>Checking auth...</p>
      </div>
    );
  }

  // ✅ Logged out view
  if (!session) {
    return (
      <div style={{ maxWidth: 600, margin: "48px auto", padding: 16 }}>
        <h1>Home</h1>
        <p>You are not logged in.</p>

        <button
          onClick={() => navigate("/auth")}
          style={{ padding: 10, marginTop: 12 }}
        >
          Sign in
        </button>
      </div>
    );
  }

  // ✅ Logged in view
  return (
    <div style={{ maxWidth: 600, margin: "48px auto", padding: 16 }}>
      <h1>Home</h1>
      <p>
        ✅ Auth works. Logged in as <b>{session.user.email}</b>
      </p>

      <button
        onClick={async () => {
          await signOut();
          navigate("/", { replace: true });
        }}
        style={{ padding: 10, marginTop: 12 }}
      >
        Log out
      </button>
    </div>
  );
}
