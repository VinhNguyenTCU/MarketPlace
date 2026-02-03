import { Router } from "express";
import { supabaseAnon } from "../../supabase/client.js";
import { requireAuth } from "./requireAuth.js";

export const authRouter = Router();

// GET /
authRouter.get("/", async (req, res) => {
  return res.json({"message": "here is the auth router"});
});

// POST /auth/signup
authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supabaseAnon.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  // data.session may be null if email confirmation is enabled
  return res.json({
    user: data.user,
    session: data.session,
    message: data.session ? "Signed up" : "Check your email to confirm your account",
  });
});

// POST /auth/signin
authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  return res.json({ user: data.user, session: data.session });
});

// GET /auth/me (protected)
authRouter.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});
