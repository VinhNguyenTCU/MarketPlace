import { describe, it, expect, vi, beforeEach } from "vitest";
import { listingsRepository } from "../repository/listings.repository.js";
import { ListingStatus } from "../types/listing.js";

const { userFrom, adminFrom, anonFrom } = vi.hoisted(() => ({
  userFrom: vi.fn(),
  adminFrom: vi.fn(),
  anonFrom: vi.fn(),
}));

vi.mock("../supabase/client.js", () => ({
  getSupabaseUserClient: vi.fn(() => ({ from: userFrom })),
  getSupabaseAdminClient: vi.fn(() => ({ from: adminFrom })),
  getSupabaseAnonClient: vi.fn(() => ({ from: anonFrom })),
}));

import {
  getSupabaseUserClient,
  getSupabaseAdminClient,
  getSupabaseAnonClient,
} from "../supabase/client.js";

function makeQueryBuilder(result: { data?: any; error?: any } = {}) {
  const builder: any = {
    data: result.data ?? null,
    error: result.error ?? null,
  };

  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.single = vi.fn(() => builder);
  builder.insert = vi.fn(() => builder);
  builder.update = vi.fn(() => builder);
  builder.delete = vi.fn(() => builder);
  builder.or = vi.fn(() => builder);
  builder.order = vi.fn(() => builder);
  builder.range = vi.fn(() => builder);
  builder.gte = vi.fn(() => builder);
  builder.lte = vi.fn(() => builder);
  builder.limit = vi.fn(() => builder);

  return builder;
}

describe("listingsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllListingsFromSelf returns response and queries listings", async () => {
    const builder = makeQueryBuilder({ data: [{ id: "l1" }], error: null });
    userFrom.mockReturnValue(builder);

    const res = await listingsRepository.getAllListingsFromSelf("token");

    expect(getSupabaseUserClient).toHaveBeenCalledWith("token");
    expect(userFrom).toHaveBeenCalledWith("listings");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(res.data?.[0]?.id).toBe("l1");
  });

  it("getListingById throws on error", async () => {
    const builder = makeQueryBuilder({ error: new Error("bad") });
    userFrom.mockReturnValue(builder);

    await expect(
      listingsRepository.getListingById("token", "listing-1"),
    ).rejects.toThrow("bad");

    expect(builder.eq).toHaveBeenCalledWith("id", "listing-1");
    expect(builder.single).toHaveBeenCalled();
  });

  it("searchListings builds query with filters and range", async () => {
    const builder = makeQueryBuilder({ data: [], error: null });
    userFrom.mockReturnValue(builder);

    const res = await listingsRepository.searchListings("token", {
      query: "phone",
      categoryId: "cat1",
      conditionId: "cond1",
      status: ListingStatus.ACTIVE,
      isFree: false,
      minPrice: 10,
      maxPrice: 100,
      offset: 5,
      limit: 10,
    });

    expect(getSupabaseUserClient).toHaveBeenCalledWith("token");
    expect(builder.select).toHaveBeenCalledWith("*", { count: "exact" });
    expect(builder.or).toHaveBeenCalledWith(
      "title.ilike.%phone%,description.ilike.%phone%",
    );
    expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(builder.range).toHaveBeenCalledWith(5, 14);
    expect(builder.eq).toHaveBeenCalledWith("category_id", "cat1");
    expect(builder.eq).toHaveBeenCalledWith("condition_id", "cond1");
    expect(builder.eq).toHaveBeenCalledWith("status", ListingStatus.ACTIVE);
    expect(builder.eq).toHaveBeenCalledWith("is_free", false);
    expect(builder.gte).toHaveBeenCalledWith("price", 10);
    expect(builder.lte).toHaveBeenCalledWith("price", 100);
    expect(res.error).toBeNull();
  });

  it("getListingsByCategoryId and getListingsByCondition and getListingsByStatus", async () => {
    const builder = makeQueryBuilder({ data: [], error: null });
    userFrom.mockReturnValue(builder);

    await listingsRepository.getListingsByCategoryId("token", "cat1");
    expect(builder.eq).toHaveBeenCalledWith("category_id", "cat1");

    await listingsRepository.getListingsByCondition("token", "good");
    expect(builder.select).toHaveBeenCalledWith("*, conditions!inner(id, name)");
    expect(builder.eq).toHaveBeenCalledWith("conditions.name", "good");

    await listingsRepository.getListingsByStatus("token", ListingStatus.SOLD);
    expect(builder.eq).toHaveBeenCalledWith("status", ListingStatus.SOLD);
  });

  it("createListing inserts and returns record", async () => {
    const builder = makeQueryBuilder({ data: { id: "l1" }, error: null });
    userFrom.mockReturnValue(builder);

    const input = {
      title: "t",
      description: "desc",
      category_id: "cat1",
      condition_id: "cond1",
      price: 10,
      is_free: false,
      location: "TCU",
    };

    const res = await listingsRepository.createListing("token", input);

    expect(builder.insert).toHaveBeenCalledWith(input);
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.single).toHaveBeenCalled();
    expect(res.data?.id).toBe("l1");
  });

  it("updateListing updates and returns record", async () => {
    const builder = makeQueryBuilder({ data: { id: "l1" }, error: null });
    userFrom.mockReturnValue(builder);

    const res = await listingsRepository.updateListing("token", "id1", { price: 5 });

    expect(builder.update).toHaveBeenCalledWith({ price: 5 });
    expect(builder.eq).toHaveBeenCalledWith("id", "id1");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.single).toHaveBeenCalled();
    expect(res.data?.id).toBe("l1");
  });

  it("deleteListing deletes and returns id", async () => {
    const builder = makeQueryBuilder({ data: { id: "l1" }, error: null });
    userFrom.mockReturnValue(builder);

    const res = await listingsRepository.deleteListing("token", "l1");

    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "l1");
    expect(builder.select).toHaveBeenCalledWith("id");
    expect(builder.single).toHaveBeenCalled();
    expect(res.data?.id).toBe("l1");
  });

  it("getMostRecent uses anon client and limits 20", async () => {
    const builder = makeQueryBuilder({ data: [], error: null });
    anonFrom.mockReturnValue(builder);

    const res = await listingsRepository.getMostRecent();

    expect(getSupabaseAnonClient).toHaveBeenCalled();
    expect(anonFrom).toHaveBeenCalledWith("listings");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.limit).toHaveBeenCalledWith(20);
    expect(res.error).toBeNull();
  });

  it("getListingsByUser uses admin client and filters seller_id", async () => {
    const builder = makeQueryBuilder({ data: [], error: null });
    adminFrom.mockReturnValue(builder);

    const res = await listingsRepository.getListingsByUser("user1");

    expect(getSupabaseAdminClient).toHaveBeenCalled();
    expect(adminFrom).toHaveBeenCalledWith("listings");
    expect(builder.eq).toHaveBeenCalledWith("seller_id", "user1");
    expect(res.error).toBeNull();
  });
});
