import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mock: must be before importing the service
let repoMock: any;

vi.mock("../repository/listings.repository.js", () => {
  // Constructible mock (works with `new`)
  class ListingsRepositoryMock {
    getAllListings = (...args: any[]) => repoMock.getAllListings(...args);
    getListingById = (...args: any[]) => repoMock.getListingById(...args);
    getListingsByCategory = (...args: any[]) => repoMock.getListingsByCategory(...args);
    getListingsByStatus = (...args: any[]) => repoMock.getListingsByStatus(...args);
    createListing = (...args: any[]) => repoMock.createListing(...args);
    getListingsByUser = (...args: any[]) => repoMock.getListingsByUser(...args);
  }

  return { ListingsRepository: ListingsRepositoryMock };
});

import { ListingsService } from "../service/listings.service.js";

describe("ListingsService", () => {
  const accessToken = "token123";
  const listingId = "l1";
  const categoryId = "cat1";
  const status = "active";
  const userId = "u1";

  beforeEach(() => {
    repoMock = {
      getAllListings: vi.fn(),
      getListingById: vi.fn(),
      getListingsByCategory: vi.fn(),
      getListingsByStatus: vi.fn(),
      createListing: vi.fn(),
      getListingsByUser: vi.fn(),
    };
  });

  it("getAllListings returns ok=true when repo resolves", async () => {
    const envelope = { data: [{ id: "l1" }], error: null, status: 200, statusText: "OK" };
    repoMock.getAllListings.mockResolvedValue(envelope);

    const svc = new ListingsService();
    const res = await svc.getAllListings(accessToken);

    expect(repoMock.getAllListings).toHaveBeenCalledWith(accessToken);
    expect(res).toEqual({ ok: true, data: envelope });
  });

  it("getAllListings returns ok=false when repo rejects", async () => {
    repoMock.getAllListings.mockRejectedValue(new Error("db error"));

    const svc = new ListingsService();
    const res = await svc.getAllListings(accessToken);

    expect(repoMock.getAllListings).toHaveBeenCalledWith(accessToken);
    expect(res).toEqual({ ok: false, status: 400, error: "db error" });
  });

  it("getListingById returns ok=true when repo resolves", async () => {
    const envelope = { data: { id: listingId }, error: null, status: 200 };
    repoMock.getListingById.mockResolvedValue(envelope);

    const svc = new ListingsService();
    const res = await svc.getListingById(accessToken, listingId);

    expect(repoMock.getListingById).toHaveBeenCalledWith(accessToken, listingId);
    expect(res).toEqual({ ok: true, data: envelope });
  });

  it("getListingById returns ok=false when repo rejects", async () => {
    repoMock.getListingById.mockRejectedValue(new Error("not found"));

    const svc = new ListingsService();
    const res = await svc.getListingById(accessToken, listingId);

    expect(repoMock.getListingById).toHaveBeenCalledWith(accessToken, listingId);
    expect(res).toEqual({ ok: false, status: 400, error: "not found" });
  });

  it("getListingsByCategory returns ok=true when repo resolves", async () => {
    const envelope = { data: [{ id: "l2", category_id: categoryId }], error: null, status: 200 };
    repoMock.getListingsByCategory.mockResolvedValue(envelope);

    const svc = new ListingsService();
    const res = await svc.getListingsByCategory(accessToken, categoryId);

    expect(repoMock.getListingsByCategory).toHaveBeenCalledWith(accessToken, categoryId);
    expect(res).toEqual({ ok: true, data: envelope });
  });

  it("getListingsByStatus returns ok=false when repo rejects", async () => {
    repoMock.getListingsByStatus.mockRejectedValue(new Error("bad status"));

    const svc = new ListingsService();
    const res = await svc.getListingsByStatus(accessToken, status);

    expect(repoMock.getListingsByStatus).toHaveBeenCalledWith(accessToken, status);
    expect(res).toEqual({ ok: false, status: 400, error: "bad status" });
  });

  it("createListing returns ok=true when repo resolves", async () => {
    const listingData = { title: "New" };
    const envelope = { data: { id: "l3", ...listingData }, error: null, status: 201 };
    repoMock.createListing.mockResolvedValue(envelope);

    const svc = new ListingsService();
    const res = await svc.createListing(accessToken, listingData);

    expect(repoMock.createListing).toHaveBeenCalledWith(accessToken, listingData);
    expect(res).toEqual({ ok: true, data: envelope });
  });

  it("getListingsByUser returns ok=true when repo resolves", async () => {
    const envelope = { data: [{ id: "l4", seller_id: userId }], error: null, status: 200 };
    repoMock.getListingsByUser.mockResolvedValue(envelope);

    const svc = new ListingsService();
    const res = await svc.getListingsByUser(userId);

    expect(repoMock.getListingsByUser).toHaveBeenCalledWith(userId);
    expect(res).toEqual({ ok: true, data: envelope });
  });
});
