import type { Request, Response } from "express";
import { ProfileService } from "../service/profile.service.js";

export class ProfileController {
  private profileService = new ProfileService();

  me = async (req: Request, res: Response) => {
    const token = req.accessToken;
    if (!token) return res.status(401).json({ error: "Missing access token" });

    const result = await this.profileService.getMyProfile(token);
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    return res.json({ profile: result.data });
  };
}