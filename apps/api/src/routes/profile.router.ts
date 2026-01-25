import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { ProfileController } from "../controller/profile.controller.js";

export const profileRouter = Router();
const controller = new ProfileController();

profileRouter.get("/me", requireAuth, controller.me);
