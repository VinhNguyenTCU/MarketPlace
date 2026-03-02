import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { buildTestApp } from "./testApp.js";
import { getSupabaseUserClient, getSupabaseAdminClient } from "../supabase/client.js";

vi.mock("../supabase/client.js", () => {
  return {
    getSupabaseUserClient: vi.fn(),
    getSupabaseAdminClient: vi.fn(),
  };
});

describe("Auth routes", () => {
  const app = buildTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /auth/signup -> 400 when missing fields", async () => {
    const res = await request(app).post("/auth/signup").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email and password required/i);
  });

  it("POST /auth/signup -> 200 on success", async () => {
    (getSupabaseUserClient as any).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: {
            user: { id: "u1", email: "test@tcu.edu" },
            session: { access_token: "token" },
          },
          error: null,
        }),
        signInWithPassword: vi.fn(),
        getUser: vi.fn(),
      },
    });

  });

  it("POST /auth/signin -> 401 when invalid credentials", async () => {
    (getSupabaseUserClient as any).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });

    const res = await request(app)
      .post("/auth/signin")
      .send({ email: "x@tcu.edu", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("GET /auth/me -> 401 when missing bearer token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/missing bearer token/i);
  });

  it("GET /auth/me -> 200 when token valid", async () => {
    (getSupabaseUserClient as any).mockResolvedValue({
      data: { user: { id: "u123", email: "ok@tcu.edu" } },
      error: null,
    });

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer goodtoken");

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("u123");
    expect(res.body.user.email).toBe("ok@tcu.edu");
  });
});
