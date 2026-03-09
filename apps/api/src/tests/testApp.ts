import express from "express";
import authRouter from "../routes/auth.router.js";

export function buildTestApp() {
  const app = express();
  app.use(express.json());

  app.use("/auth", authRouter);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}