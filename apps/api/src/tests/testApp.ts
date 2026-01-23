import express from "express";
import { authRouter } from "../modules/auth/auth.router.js";

export function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  return app;
}
