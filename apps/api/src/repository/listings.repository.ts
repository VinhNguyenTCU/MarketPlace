import {
  getSupabaseUserClient,
  getSupabaseAdminClient,
  getSupabaseAnonClient,
} from "../supabase/client.js";
import type {
  CreateListingInput,
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

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;
    const from = offset;
    const to = offset + limit - 1;

    let qb = supabase
      .from("listings")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params.query) {
      qb = qb.or(
        `title.ilike.%${params.query}%,description.ilike.%${params.query}%`,
      );
    }

    if (params.categoryId) {
      qb = qb.eq("category_id", params.categoryId);
    }

    if (params.conditionId) {
      qb = qb.eq("condition_id", params.conditionId);
    }

    if (params.status) {
      qb = qb.eq("status", params.status);
    }

    if (params.isFree !== undefined) {
      qb = qb.eq("is_free", params.isFree);
    }

    if (params.minPrice !== undefined) {
      qb = qb.gte("price", params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      qb = qb.lte("price", params.maxPrice);
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
      .eq("category_id", category_id);

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
      .eq("conditions.name", condition);

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
    listingData: CreateListingInput,
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

    const res = await supabase
      .from("listings")
      .update(updates)
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
    const res = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

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
