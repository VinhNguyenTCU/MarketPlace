import express from "express";
import authRouter from "./routes/auth.router.js";
import { profileRouter } from "./routes/profile.router.js";

export const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));