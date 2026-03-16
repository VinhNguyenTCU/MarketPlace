import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListingService } from "../service/listing.service.js";
import { ListingStatus, type Listing } from "../types/listing.js";
import { listingsRepository } from "../repository/listings.repository.js";

vi.mock("../repository/listings.repository.js", () => ({
  listingsRepository: {
    getAllListingsFromSelf: vi.fn(),
    getListingById: vi.fn(),
    searchListings: vi.fn(),
    getListingsByCategoryId: vi.fn(),
    getListingsByCondition: vi.fn(),
    getListingsByStatus: vi.fn(),
    createListing: vi.fn(),
    updateListing: vi.fn(),
    deleteListing: vi.fn(),
    getMostRecent: vi.fn(),
    getListingsByUser: vi.fn(),
  },
}));

const sampleListing: Listing = {
  id: "listing-1",
  seller_id: "seller-1",
  title: "Desk",
  description: "Wooden desk",
  category_id: "cat-1",
  condition_id: "cond-1",
  price: 75,
  is_free: false,
  status: ListingStatus.ACTIVE,
  location: "TCU",
  created_at: "2026-03-15T00:00:00.000Z",
};

describe("ListingService", () => {
  const service = new ListingService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMyListings returns repository data", async () => {
    vi.mocked(listingsRepository.getAllListingsFromSelf).mockResolvedValue({
      data: [sampleListing],
    } as any);

    const result = await service.getMyListings("token");

    expect(listingsRepository.getAllListingsFromSelf).toHaveBeenCalledWith("token");
    expect(result).toEqual({ ok: true, data: [sampleListing] });
  });

  it("getListingById returns validation error for blank id", async () => {
    const result = await service.getListingById("token", "   ");

    expect(result).toEqual({ ok: false, error: "listingId is required" });
    expect(listingsRepository.getListingById).not.toHaveBeenCalled();
  });

  it("getListingById returns listing when found", async () => {
    vi.mocked(listingsRepository.getListingById).mockResolvedValue({
      data: sampleListing,
    } as any);

    const result = await service.getListingById("token", "listing-1");

    expect(listingsRepository.getListingById).toHaveBeenCalledWith(
      "token",
      "listing-1",
    );
    expect(result).toEqual({ ok: true, data: sampleListing });
  });

  it("searchListings normalizes query, offset, and limit", async () => {
    vi.mocked(listingsRepository.searchListings).mockResolvedValue({
      data: [sampleListing],
      count: 1,
    } as any);

    const result = await service.searchListings("token", {
      query: "  desk  ",
    });

    expect(listingsRepository.searchListings).toHaveBeenCalledWith("token", {
      query: "desk",
      offset: 0,
      limit: 20,
    });
    expect(result).toEqual({
      ok: true,
      data: {
        items: [sampleListing],
        count: 1,
        offset: 0,
        limit: 20,
      },
    });
  });

  it("searchListings returns validation error for invalid price range", async () => {
    const result = await service.searchListings("token", {
      query: "desk",
      minPrice: 100,
      maxPrice: 50,
    });

    expect(result).toEqual({
      ok: false,
      error: "Maximum price cannot be less than minimum price",
    });
    expect(listingsRepository.searchListings).not.toHaveBeenCalled();
  });

  it("getListingsByCategoryId returns validation error for blank id", async () => {
    const result = await service.getListingsByCategoryId("token", " ");

    expect(result).toEqual({ ok: false, error: "categoryId is required" });
  });

  it("getListingsByCondition returns repository data", async () => {
    vi.mocked(listingsRepository.getListingsByCondition).mockResolvedValue({
      data: [sampleListing],
    } as any);

    const result = await service.getListingsByCondition("token", "GOOD");

    expect(listingsRepository.getListingsByCondition).toHaveBeenCalledWith(
      "token",
      "GOOD",
    );
    expect(result).toEqual({ ok: true, data: [sampleListing] });
  });

  it("getListingsByCondition returns repository error", async () => {
    vi.mocked(listingsRepository.getListingsByCondition).mockRejectedValue(
      new Error("condition failed"),
    );

    const result = await service.getListingsByCondition("token", "GOOD");

    expect(result).toEqual({ ok: false, error: "condition failed" });
  });

  it("getListingsByStatus returns repository data", async () => {
    vi.mocked(listingsRepository.getListingsByStatus).mockResolvedValue({
      data: [sampleListing],
    } as any);

    const result = await service.getListingsByStatus(
      "token",
      ListingStatus.ACTIVE,
    );

    expect(listingsRepository.getListingsByStatus).toHaveBeenCalledWith(
      "token",
      ListingStatus.ACTIVE,
    );
    expect(result).toEqual({ ok: true, data: [sampleListing] });
  });

  it("createListing returns error when repository returns no data", async () => {
    vi.mocked(listingsRepository.createListing).mockResolvedValue({
      data: null,
    } as any);

    const result = await service.createListing("token", {
      title: "Desk",
      description: "Wooden desk",
      category_id: "cat-1",
      condition_id: "cond-1",
      price: 75,
      is_free: false,
      location: "TCU",
    });

    expect(result).toEqual({ ok: false, error: "Failed to create listing" });
  });

  it("updateListing returns validation error for blank id", async () => {
    const result = await service.updateListing("token", "", { title: "Updated" });

    expect(result).toEqual({ ok: false, error: "listingId is required" });
    expect(listingsRepository.updateListing).not.toHaveBeenCalled();
  });

  it("updateListing returns updated listing", async () => {
    vi.mocked(listingsRepository.updateListing).mockResolvedValue({
      data: { ...sampleListing, title: "Updated desk" },
    } as any);

    const result = await service.updateListing("token", "listing-1", {
      title: "Updated desk",
    });

    expect(listingsRepository.updateListing).toHaveBeenCalledWith(
      "token",
      "listing-1",
      { title: "Updated desk" },
    );
    expect(result).toEqual({
      ok: true,
      data: { ...sampleListing, title: "Updated desk" },
    });
  });

  it("deleteListing returns deleted id", async () => {
    vi.mocked(listingsRepository.deleteListing).mockResolvedValue({
      data: { id: "listing-1" },
    } as any);

    const result = await service.deleteListing("token", "listing-1");

    expect(listingsRepository.deleteListing).toHaveBeenCalledWith(
      "token",
      "listing-1",
    );
    expect(result).toEqual({ ok: true, data: { id: "listing-1" } });
  });

  it("getMostRecent returns repository data", async () => {
    vi.mocked(listingsRepository.getMostRecent).mockResolvedValue({
      data: [sampleListing],
    } as any);

    const result = await service.getMostRecent();

    expect(result).toEqual({ ok: true, data: [sampleListing] });
  });

  it("getListingsByUser returns validation error for blank userId", async () => {
    const result = await service.getListingsByUser("   ");

    expect(result).toEqual({ ok: false, error: "userId is required" });
    expect(listingsRepository.getListingsByUser).not.toHaveBeenCalled();
  });

  it("returns repository error messages in catch blocks", async () => {
    vi.mocked(listingsRepository.getAllListingsFromSelf).mockRejectedValue(
      new Error("boom"),
    );

    const result = await service.getMyListings("token");

    expect(result).toEqual({ ok: false, error: "boom" });
  });
});
