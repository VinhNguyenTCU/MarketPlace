// src/services/auth.service.ts
import { supabase } from "../lib/supabase";

function getApiBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) throw new Error("Missing VITE_API_BASE_URL in frontend .env");
  return base.replace(/\/+$/, "");
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const base = getApiBaseUrl();

  // Get latest session (Supabase will refresh internally if needed)
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data.session?.access_token;

  const headers = new Headers(init.headers);

  // Only attach Authorization when we have a session
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Add JSON header only if we have a body and caller didn't set it
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${base}${path}`, { ...init, headers });

  // If backend rejects, clear session (revoked/expired refresh token)
  if (res.status === 401) {
    await supabase.auth.signOut();
  }

  return res;
}

// ---------- API FUNCTIONS ----------

export async function signup(email: string, password: string, fullName?: string) {
  if (!email || !password) throw new Error("Email and password are required.");

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Sign up failed.");
  }

  // backend returns { user, session, message }
  // session may be null if email confirmation is required
  return json as {
    user: any;
    session: any | null;
    message?: string;
  };
}

export async function signin(email: string, password: string) {
  if (!email || !password) throw new Error("Email and password are required.");

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Sign in failed.");
  }

  // Your backend returns: { user, access_token, refresh_token }
  const access_token = json?.access_token as string | undefined;
  const refresh_token = json?.refresh_token as string | undefined;

  if (!access_token || !refresh_token) {
    throw new Error("Missing tokens returned from server.");
  }

  // 👇 Key: store into Supabase session store (auto refresh works from here)
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;

  return json as {
    user: any;
    access_token: string;
    refresh_token: string;
  };
}

export async function signout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getMyProfile() {
  const res = await apiFetch("/auth/me", { method: "GET" });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Failed to fetch profile.");
  }

  return json;
}
