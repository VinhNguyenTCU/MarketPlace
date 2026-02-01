import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const controller = new AuthController();

router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.post("/refresh", controller.refresh);
router.get("/me", requireAuth, controller.me);

export default router;