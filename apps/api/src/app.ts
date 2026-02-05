import express from "express";
import authRouter from "./routes/auth.router.js";
import { profileRouter } from "./routes/profile.router.js";

export const app = express();
app.use(express.json());

<<<<<<< HEAD
// app.get("/health", (_req, res) => res.json({ ok: true }));

=======
>>>>>>> d47b934 (restructure from modules project structure to controller/service/repository project structure, add basic unit tests for auth routes)
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));