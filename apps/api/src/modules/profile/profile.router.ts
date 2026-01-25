import { Router } from "express";
import { requireAuth } from "../auth/requireAuth.js";
import { createClient } from "@supabase/supabase-js";

export const profileRouter = Router();

profileRouter.get("/me", requireAuth, async (req, res) => {
  const token = req.accessToken!;

  // Create a Supabase client “as the user” so RLS + auth.uid() work
  const supabaseAsUser = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data, error } = await supabaseAsUser
    .from("profiles")
    .select("*")
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ profile: data });
});
