import express from "express";
import authRouter from "./routes/auth.router.js";

export const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));