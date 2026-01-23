import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { requireAuth } from "../modules/auth/requireAuth.js";

vi.mock("../supabase/client.js", () => ({
  supabaseAnon: {
    auth: { getUser: vi.fn() },
  },
}));

import { supabaseAnon } from "../supabase/client.js";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("requireAuth middleware", () => {
  it("returns 401 if no Authorization header", async () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user for valid token", async () => {
    (supabaseAnon.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "u1", email: "e@tcu.edu" } },
      error: null,
    });

    const req = { headers: { authorization: "Bearer token" } } as any as Request;
    const res = mockRes();
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(req.user!.id).toBe("u1");
    expect(next).toHaveBeenCalled();
  });
});
