import {
  getSupabaseUserClient,
  getSupabaseAdminClient,
  getSupabaseAnonClient,
} from "../supabase/client.js";
import type {
  Listing,
  ListingUpdateInput,
  ListingStatus,
  SearchListingsParams,
} from "../types/listing.ts";
import "dotenv/config";

import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

export const listingsRepository = {
  async getAllListingsFromSelf(
    accessToken: string,
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);
    const res = await supabase.from("listings").select("*");
    if (res.error) throw res.error;
    return res;
  },

  async getListingById(
    accessToken: string,
    listingId: string,
  ): Promise<PostgrestSingleResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);
    const res = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();
    if (res.error) throw res.error;
    return res;
  },

  async searchListings(
    accessToken: string,
    params: SearchListingsParams,
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);

    const q = params.query.trim();
    if (!q) throw new Error("query field cannot be empty");

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;
    if (offset < 0) throw new Error("offset must be >= 0");
    if (limit <= 0 || limit > 100) throw new Error("limit must be 1..100");

    const from = offset;
    const to = offset + limit - 1;

    let qb = supabase
      .from("listings")
      .select("*", { count: "exact" })
      // text search (case-insensitive substring) across title + description
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    // filters
    if (params.categoryId) qb = qb.eq("category_id", params.categoryId);
    if (params.conditionId) qb = qb.eq("condition_id", params.conditionId);
    if (params.status) qb = qb.eq("status", params.status);
    if (params.isFree !== undefined) qb = qb.eq("is_free", params.isFree);

    // price filters
    if (params.minPrice !== undefined) {
      if (Number.isNaN(params.minPrice)) throw new Error("minPrice is invalid");
      qb = qb.gte("price", params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      if (Number.isNaN(params.maxPrice)) throw new Error("maxPrice is invalid");
      qb = qb.lte("price", params.maxPrice);
    }

    // sanity: min <= max
    if (
      params.minPrice !== undefined &&
      params.maxPrice !== undefined &&
      params.minPrice > params.maxPrice
    ) {
      throw new Error("minPrice cannot be greater than maxPrice");
    }

    const res = await qb;
    if (res.error) throw res.error;
    return res;
  },

  async getListingsByCategoryId(
    accessToken: string,
    category_id: string,
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);

    const res = await supabase
      .from("listings")
      .select("*")
      .eq("listings.category_id", category_id);

    if (res.error) throw res.error;
    return res;
  },

  async getListingsByCondition(
    accessToken: string,
    condition: string,
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);

    const res = await supabase
      .from("listings")
      .select("*, conditions!inner(id, name)")
      .eq("conditions.bname", condition);
    if (res.error) throw res.error;
    return res;
  },

  async getListingsByStatus(
    accessToken: string,
    status: ListingStatus,
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);
    const res = await supabase
      .from("listings")
      .select("*")
      .eq("status", status);
    if (res.error) throw res.error;
    return res;
  },

  async createListing(
    accessToken: string,
    listingData: Partial<Listing>,
  ): Promise<PostgrestSingleResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);
    const res = await supabase
      .from("listings")
      .insert(listingData)
      .select("*")
      .single();
    if (res.error) throw res.error;
    return res;
  },

  async updateListing(
    accessToken: string,
    id: string,
    updates: ListingUpdateInput,
  ): Promise<PostgrestSingleResponse<Listing>> {
    const supabase = getSupabaseUserClient(accessToken);

    const { ...safeUpdates } = updates;

    if (!safeUpdates || Object.keys(safeUpdates).length === 0) {
      throw new Error("No valid fields to update.");
    }

    // If price is being updated, block increases
    if (safeUpdates.price !== undefined && safeUpdates.price !== null) {
      const current = await supabase
        .from("listings")
        .select("price")
        .eq("id", id)
        .single();

      if (current.error) throw current.error;

      const oldPrice = Number(current.data.price);
      const newPrice = Number(current.data.price);

      if (Number.isNaN(oldPrice) || Number.isNaN(newPrice)) {
        throw new Error("Invalid price value.");
      }

      if (newPrice > oldPrice) {
        throw new Error("Price can only be increased, not decreased");
      }
    }

    const res = await supabase
      .from("listings")
      .update(safeUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (res.error) throw res.error;
    return res;
  },

  async deleteListing(
    accessToken: string,
    listingId: string,
  ): Promise<PostgrestSingleResponse<Pick<Listing, "id">>> {
    const supabase = getSupabaseUserClient(accessToken);

    const res = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId)
      .select("id")
      .single();

    if (res.error) throw res.error;
    return res;
  },

  async getMostRecent() {
    const supabase = getSupabaseAnonClient();

    // fetches the 20 most recent items
    const res = await supabase.from("listings").select("*").limit(20);

    if (res.error) throw res.error;
    return res;
  },

  // Admin-level access
  async getListingsByUser(userId: string): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseAdminClient();
    const res = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", userId);
    if (res.error) throw res.error;
    return res;
  },
} as const;
