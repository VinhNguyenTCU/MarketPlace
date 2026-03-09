import { supabase } from "./supabase";

export function getApiBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) throw new Error("Missing VITE_API_BASE_URL");
  return base.replace(/\/+$/, "");
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const base = getApiBaseUrl();

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data.session?.access_token;

  const headers = new Headers(init.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${base}${path}`, { ...init, headers });

  if (res.status === 401) {
    await supabase.auth.signOut();
  }

  return res;
}