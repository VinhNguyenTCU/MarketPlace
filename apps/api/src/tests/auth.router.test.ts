import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { buildTestApp } from "./testApp.js";
import { getSupabaseAnonClient } from "../supabase/client.js";

const mockAnonClient = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    refreshSession: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock("../supabase/client.js", () => ({
  getSupabaseAnonClient: vi.fn(() => mockAnonClient),
}));

function mockActiveUserLookup() {
  (getSupabaseAnonClient() as any).from = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { status: "active", role: "user" },
          error: null,
        }),
      }),
    }),
  });
}

describe("Auth routes", () => {
  const app = buildTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveUserLookup();
  });

  it("POST /auth/signup -> 400 when missing fields", async () => {
    const res = await request(app).post("/auth/signup").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email and password required/i);
  });

  it("POST /auth/signup -> 200 on success", async () => {
    (getSupabaseAnonClient() as any).auth.signUp.mockResolvedValue({
      data: {
        user: { id: "u1", email: "test@tcu.edu" },
        session: { access_token: "access", refresh_token: "refresh" },
      },
      error: null,
    });

    const res = await request(app)
      .post("/auth/signup")
      .send({ email: "test@tcu.edu", password: "Password123!" });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("u1");
    expect((getSupabaseAnonClient() as any).auth.signUp).toHaveBeenCalledWith({
      email: "test@tcu.edu",
      password: "Password123!",
    });
  });

  it("POST /auth/signin -> 401 when invalid credentials", async () => {
    (getSupabaseAnonClient() as any).auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });

    const res = await request(app)
      .post("/auth/signin")
      .send({ email: "x@tcu.edu", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("POST /auth/refresh -> 200 when refresh token is valid", async () => {
    (getSupabaseAnonClient() as any).auth.refreshSession.mockResolvedValue({
      data: {
        session: {
          access_token: "new-access",
          refresh_token: "new-refresh",
        },
      },
      error: null,
    });

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token: "old-refresh" });

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBe("new-access");
    expect(res.body.refresh_token).toBe("new-refresh");
  });

  it("GET /auth/me -> 401 when missing bearer token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/missing bearer token/i);
  });

  it("GET /auth/me -> 200 when token valid", async () => {
    (getSupabaseAnonClient() as any).auth.getUser.mockResolvedValue({
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
