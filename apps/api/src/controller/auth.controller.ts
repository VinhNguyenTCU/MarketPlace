import type { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";

export class AuthController {
  private service = new AuthService();

  signup = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const result = await this.service.signup(email, password);
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    return res.json(result.data);
  };

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const result = await this.service.signin(email, password);
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    return res.json(result.data);
  };

  refresh = async (req: Request, res: Response) => {
    const { refresh_token } = req.body ?? {};
    if (!refresh_token) return res.status(400).json({ error: "refresh_token required" });

    const result = await this.service.refresh(refresh_token);
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    return res.json(result.data);
  };

  me = async (req: Request, res: Response) => {
    return res.json({ user: req.user });
  };
}