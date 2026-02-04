import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListingsRepository } from "../repository/listings.repository.js";

// Mock supabase client factory fns
vi.mock("../supabase/client.js", () => {
  return {
    getSupabaseAnon: vi.fn(),
    getSupabaseAdmin: vi.fn(),
  };
});

import { getSupabaseAnon, getSupabaseAdmin } from "../supabase/client.js";

type PgEnvelope = {
  data: any;
  error: any;
  status?: number;
  statusText?: string;
  count?: any;
};

type SupabaseHandlers = {
  // select("*") directly returns envelope
  select?: () => Promise<PgEnvelope>;

  // select("*").eq(...).single() returns envelope
  selectEqSingle?: () => Promise<PgEnvelope>;

  // select("*").eq(...) returns envelope (array)
  selectEq?: () => Promise<PgEnvelope>;

  // insert(data).select("*").single() returns envelope
  insertSelectSingle?: () => Promise<PgEnvelope>;
};

function buildSupabaseMock(handlers: SupabaseHandlers) {
  const from = vi.fn((_table: string) => {
    const select = vi.fn((_cols: string) => {
      // Case 1: direct select
      if (handlers.select) return handlers.select();

      // Case 2: select -> eq -> single OR eq
      return {
        eq: vi.fn((_col: string, _val: string) => {
          if (handlers.selectEqSingle) {
            return { single: vi.fn(() => handlers.selectEqSingle!()) };
          }
          if (handlers.selectEq) {
            return handlers.selectEq!();
          }
          return undefined;
        }),
      };
    });

    const insert = vi.fn((_data: any) => {
      // Must support insert().select().single()
      return {
        select: vi.fn((_cols: string) => {
          if (handlers.insertSelectSingle) {
            return { single: vi.fn(() => handlers.insertSelectSingle!()) };
          }
          return undefined;
        }),
      };
    });

    return { select, insert };
  });

  return { from } as any;
}

const pgError = (message: string) => ({
  name: "PostgrestError",
  message,
  details: null,
  hint: null,
  code: "X",
});

describe("ListingsRepository (envelope-returning)", () => {
  const repo = new ListingsRepository();

  const baseListing = {
    id: "l1",
    seller_id: "u1",
    title: "Title",
    description: "Desc",
    category_id: "c1",
    condition_id: "cond1",
    price: "10.00",
    is_free: false,
    status: "active",
    location: "Fort Worth, TX",
    created_at: "2026-02-03T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllListings returns the envelope on success", async () => {
    const envelope = {
      data: [baseListing],
      error: null,
      status: 200,
      statusText: "OK",
    };

    const supabase = buildSupabaseMock({
      select: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    const res = await repo.getAllListings("token123");

    expect(getSupabaseAnon).toHaveBeenCalledWith("token123");
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(res).toEqual(envelope);
  });

  it("getAllListings throws when envelope.error is set", async () => {
    const envelope = {
      data: null,
      error: pgError("db error"),
      status: 400,
      statusText: "Bad Request",
    };

    const supabase = buildSupabaseMock({
      select: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.getAllListings("token123")).rejects.toThrow("db error");
  });

  it("getListingById returns the envelope on success", async () => {
    const envelope = {
      data: baseListing,
      error: null,
      status: 200,
      statusText: "OK",
    };

    const supabase = buildSupabaseMock({
      selectEqSingle: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    const res = await repo.getListingById("token123", "l1");

    expect(getSupabaseAnon).toHaveBeenCalledWith("token123");
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(res).toEqual(envelope);
  });

  it("getListingById throws when envelope.error is set", async () => {
    const envelope = {
      data: null,
      error: pgError("not found"),
      status: 406,
      statusText: "Not Acceptable",
    };

    const supabase = buildSupabaseMock({
      selectEqSingle: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.getListingById("token123", "missing")).rejects.toThrow(
      "not found"
    );
  });

  it("getListingsByCategory returns the envelope on success", async () => {
    const envelope = {
      data: [{ ...baseListing, id: "l2", category_id: "cat1" }],
      error: null,
      status: 200,
      statusText: "OK",
    };

    const supabase = buildSupabaseMock({
      selectEq: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    const res = await repo.getListingsByCategory("token123", "cat1");

    expect(getSupabaseAnon).toHaveBeenCalledWith("token123");
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(res).toEqual(envelope);
  });

  it("getListingsByStatus throws when envelope.error is set", async () => {
    const envelope = {
      data: null,
      error: pgError("status error"),
      status: 400,
      statusText: "Bad Request",
    };

    const supabase = buildSupabaseMock({
      selectEq: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.getListingsByStatus("token123", "sold")).rejects.toThrow(
      "status error"
    );
  });

  it("createListing returns the envelope on success (insert().select().single())", async () => {
    const envelope = {
      data: { ...baseListing, id: "l3" },
      error: null,
      status: 201,
      statusText: "Created",
    };

    const supabase = buildSupabaseMock({
      insertSelectSingle: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    const res = await repo.createListing("token123", { title: "New" });

    expect(getSupabaseAnon).toHaveBeenCalledWith("token123");
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(res).toEqual(envelope);
  });

  it("createListing throws when envelope.error is set", async () => {
    const envelope = {
      data: null,
      error: pgError("insert error"),
      status: 400,
      statusText: "Bad Request",
    };

    const supabase = buildSupabaseMock({
      insertSelectSingle: async () => envelope,
    });

    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.createListing("token123", { title: "New" })).rejects.toThrow(
      "insert error"
    );
  });

  it("getListingsByUser uses admin client and returns the envelope", async () => {
    const envelope = {
      data: [{ ...baseListing, id: "l4", seller_id: "user1" }],
      error: null,
      status: 200,
      statusText: "OK",
    };

    const supabase = buildSupabaseMock({
      selectEq: async () => envelope,
    });

    (getSupabaseAdmin as any).mockReturnValue(supabase);

    const res = await repo.getListingsByUser("user1");

    expect(getSupabaseAdmin).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(res).toEqual(envelope);
  });

  it("getListingsByUser throws when envelope.error is set", async () => {
    const envelope = {
      data: null,
      error: pgError("admin query failed"),
      status: 403,
      statusText: "Forbidden",
    };

    const supabase = buildSupabaseMock({
      selectEq: async () => envelope,
    });

    (getSupabaseAdmin as any).mockReturnValue(supabase);

    await expect(repo.getListingsByUser("user1")).rejects.toThrow(
      "admin query failed"
    );
  });
});
