import type { Request, Response, NextFunction } from "express";
import { supabaseAnon } from "../supabase/client.js";

export type AuthUser = {
  id: string;
  email?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      accessToken?: string | undefined;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) return res.status(401).json({ error: "Missing Bearer token" });

  const token = match[1];
  const { data, error } = await supabaseAnon.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: "Invalid or expried token " });
  }

  req.user = {
    id: data.user.id,
    ...(data.user.email ? { email: data.user.email } : {}),
  };
  req.accessToken = token;
  next();
}
