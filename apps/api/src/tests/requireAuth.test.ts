import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const mockAnonClient = {
  auth: { getUser: vi.fn() },
};

vi.mock("../supabase/client.js", () => ({
  getSupabaseAnonClient: vi.fn(() => mockAnonClient),
}));

import { getSupabaseAnonClient } from "../supabase/client.js";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("requireAuth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("401 if Authorization header missing", async () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("401 if token invalid", async () => {
    (getSupabaseAnonClient().auth.getUser as any).mockResolvedValue({
      data: { user: null },
      error: { message: "bad token" },
    });

    const req = { headers: { authorization: "Bearer bad" } } as any as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next + sets req.user when token valid", async () => {
    (getSupabaseAnonClient().auth.getUser as any).mockResolvedValue({
      data: { user: { id: "u1", email: "ok@tcu.edu" } },
      error: null,
    });

    const req = { headers: { authorization: "Bearer good" } } as any as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth(req, res, next);

    expect(req.user?.id).toBe("u1");
    expect(next).toHaveBeenCalled();
  });
});
