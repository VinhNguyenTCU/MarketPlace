import express from "express";
import authRouter from "./routes/auth.router.js";
import { profileRouter } from "./routes/profile.router.js";
import cors from "cors";

export const app = express();
app.use(express.json());

// ✅ allow Vite frontend origin
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
  // ✅ handle preflight
  app.options(/.*/, cors());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));