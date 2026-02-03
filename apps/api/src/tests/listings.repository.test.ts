import { describe, it, expect, vi, beforeEach } from "vitest";
import ListingRepository from "../repository/listing.repository.js";
// Types intentionally omitted for now to reduce TS friction in tests.

vi.mock("../supabase/client.js", () => {
  return {
    getSupabaseAnon: vi.fn(),
    getSupabaseAdmin: vi.fn(),
  };
});

import { getSupabaseAnon, getSupabaseAdmin } from "../supabase/client.js";

type SupabaseHandlers = {
  select?: () => Promise<{ data: any; error: any }>;
  selectEqSingle?: () => Promise<{ data: any; error: any }>;
  selectEq?: () => Promise<{ data: any; error: any }>;
  insertSingle?: () => Promise<{ data: any; error: any }>;
};

function buildSupabaseMock(handlers: SupabaseHandlers) {
  const from = vi.fn(() => {
    const select = vi.fn((_arg: string) => {
      if (handlers.select) return handlers.select();
      if (handlers.selectEqSingle || handlers.selectEq) {
        return {
          eq: vi.fn((_col: string, _val: string) => {
            if (handlers.selectEqSingle) {
              return { single: vi.fn(() => handlers.selectEqSingle!()) };
            }
            return handlers.selectEq!();
          }),
        };
      }
      return undefined;
    });

    const insert = vi.fn((_data: any) => {
      if (handlers.insertSingle) {
        return { single: vi.fn(() => handlers.insertSingle!()) };
      }
      return undefined;
    });

    return { select, insert };
  });

  return { from } as any;
}

describe("ListingRepository", () => {
  const repo = new ListingRepository();
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
  const pgError = (message: string) => ({
    name: "PostgrestError",
    message,
    details: null,
    hint: null,
    code: "X",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllListings returns data on success", async () => {
    const data = [baseListing];
    const supabase = buildSupabaseMock({
      select: async () => ({ data, error: null }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    const result = await repo.getAllListings("token123");

    expect(getSupabaseAnon).toHaveBeenCalledWith("token123");
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(result).toEqual(data);
  });

  it("getAllListings throws on error", async () => {
    const supabase = buildSupabaseMock({
      select: async () => ({ data: null, error: pgError("db error") }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.getAllListings("token123")).rejects.toThrow("db error");
  });

  it("getListingById returns data on success", async () => {
    const data = baseListing;
    const supabase = buildSupabaseMock({
      selectEqSingle: async () => ({ data, error: null }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    const result = await repo.getListingById("token123", "l1");

    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(result).toEqual(data);
  });

  it("getListingsByCategory returns data on success", async () => {
    const data = [{ ...baseListing, id: "l2", category_id: "cat1" }];
    const supabase = buildSupabaseMock({
      selectEq: async () => ({ data, error: null }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    const result = await repo.getListingsByCategory("token123", "cat1");

    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(result).toEqual(data);
  });

  it("getListingsByStatus throws on error", async () => {
    const supabase = buildSupabaseMock({
      selectEq: async () => ({ data: null, error: pgError("status error") }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.getListingsByStatus("token123", "sold")).rejects.toThrow(
      "status error"
    );
  });

  it("createListing returns data on success", async () => {
    const data = { ...baseListing, id: "l3" };
    const supabase = buildSupabaseMock({
      insertSingle: async () => ({ data, error: null }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    const result = await repo.createListing("token123", JSON.stringify({}));

    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(result).toEqual(data);
  });

  it("createListing throws on error", async () => {
    const supabase = buildSupabaseMock({
      insertSingle: async () => ({ data: null, error: pgError("insert error") }),
    });
    (getSupabaseAnon as any).mockReturnValue(supabase);

    await expect(repo.createListing("token123", "{}")).rejects.toThrow("insert error");
  });

  it("getListingsByUser uses admin client", async () => {
    const data = [{ ...baseListing, id: "l4", seller_id: "user1" }];
    const supabase = buildSupabaseMock({
      selectEq: async () => ({ data, error: null }),
    });
    (getSupabaseAdmin as any).mockReturnValue(supabase);

    const result = await repo.getListingsByUser("user1");

    expect(getSupabaseAdmin).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("listings");
    expect(result).toEqual(data);
  });
});
