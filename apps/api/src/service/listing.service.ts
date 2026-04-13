import { listingsRepository } from "../repository/listings.repository.js";
import type {
  Listing,
  ListingStatus,
  ListingUpdateInput,
  SearchListingsParams,
} from "../types/listing.js";

type ServiceError = {
  ok: false;
  error: string;
};

type ServiceSuccess<T> = {
  ok: true;
  data: T;
};

type SearchListingsResult = {
  items: Listing[];
  count: number;
  offset: number;
  limit: number;
};

export class ListingService {
  async getMyListings(
    accessToken: string,
  ): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    try {
      const res = await listingsRepository.getAllListingsFromSelf(accessToken);
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch listings",
      };
    }
  }

  async getListingById(
    accessToken: string,
    listingId: string,
  ): Promise<ServiceError | ServiceSuccess<Listing>> {
    if (!listingId.trim()) {
      return { ok: false, error: "listingId is required" };
    }

    try {
      const res = await listingsRepository.getListingById(
        accessToken,
        listingId,
      );

      if (!res.data) {
        return { ok: false, error: "Listing not found" };
      }

      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch listing",
      };
    }
  }

  async searchListings(
    accessToken: string,
    params: SearchListingsParams,
  ): Promise<ServiceError | ServiceSuccess<SearchListingsResult>> {
    try {
      const query = params.query?.trim() ?? "";
      const offset = params.offset ?? 0;
      const limit = params.limit ?? 20;

      if (offset < 0) {
        throw new Error("offset must be an integer >= 0");
      }

      if (params.minPrice !== undefined && params.minPrice < 0) {
        throw new Error("Minimum price cannot be less than 0");
      }

      if (params.maxPrice !== undefined && params.maxPrice < 0) {
        throw new Error("Maximum price cannot be less than 0");
      }

      if (
        params.minPrice !== undefined &&
        params.maxPrice !== undefined &&
        params.maxPrice < params.minPrice
      ) {
        throw new Error("Maximum price cannot be less than minimum price");
      }

      const res = await listingsRepository.searchListings(accessToken, {
        ...params,
        query,
        offset,
        limit,
      });

      return {
        ok: true,
        data: {
          items: res.data ?? [],
          count: res.count ?? 0,
          offset,
          limit,
        },
      };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to search listings",
      };
    }
  }

  async getListingsByCategoryId(
    accessToken: string,
    categoryId: string,
  ): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    if (!categoryId.trim()) {
      return { ok: false, error: "categoryId is required" };
    }

    try {
      const res = await listingsRepository.getListingsByCategoryId(
        accessToken,
        categoryId,
      );
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch listings by category",
      };
    }
  }

  async getListingsByCondition(
    accessToken: string,
    condition: string,
  ): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    if (!condition.trim()) {
      return { ok: false, error: "condition is required" };
    }

    try {
      const res = await listingsRepository.getListingsByCondition(
        accessToken,
        condition,
      );
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch listings by condition",
      };
    }
  }

  async getListingsByStatus(
    accessToken: string,
    status: ListingStatus,
  ): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    try {
      const res = await listingsRepository.getListingsByStatus(
        accessToken,
        status,
      );
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch listings by status",
      };
    }
  }

  async createListing(
    accessToken: string,
    listingData: Listing,
  ): Promise<ServiceError | ServiceSuccess<Listing>> {
    try {
      const res = await listingsRepository.createListing(accessToken, listingData);

      if (!res.data) {
        return { ok: false, error: "Failed to create listing" };
      }

      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to create listing",
      };
    }
  }

  async updateListing(
    accessToken: string,
    listingId: string,
    updates: ListingUpdateInput,
  ): Promise<ServiceError | ServiceSuccess<Listing>> {
    if (!listingId.trim()) {
      return { ok: false, error: "listingId is required" };
    }

    try {
      const res = await listingsRepository.updateListing(
        accessToken,
        listingId,
        updates,
      );

      if (!res.data) {
        return { ok: false, error: "Listing not found" };
      }

      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to update listing",
      };
    }
  }

  async deleteListing(
    accessToken: string,
    listingId: string,
  ): Promise<ServiceError | ServiceSuccess<Pick<Listing, "id">>> {
    if (!listingId.trim()) {
      return { ok: false, error: "listingId is required" };
    }

    try {
      const res = await listingsRepository.deleteListing(accessToken, listingId);

      if (!res.data) {
        return { ok: false, error: "Listing not found" };
      }

      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to delete listing",
      };
    }
  }

  async getMostRecent(): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    try {
      const res = await listingsRepository.getMostRecent();
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch recent listings",
      };
    }
  }

  async getListingsByUser(
    userId: string,
  ): Promise<ServiceError | ServiceSuccess<Listing[]>> {
    if (!userId.trim()) {
      return { ok: false, error: "userId is required" };
    }

    try {
      const res = await listingsRepository.getListingsByUser(userId);
      return { ok: true, data: res.data ?? [] };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch user listings",
      };
    }
  }
}
