import type { ZodISODateTime } from "zod";
import { getSupabaseAnon } from "../supabase/client.js";
import { getSupabaseAdmin } from "../supabase/client.js";
import { PostgrestError } from "@supabase/supabase-js";
import type { SupabaseQueryResult } from "../types/supabase.js";
import type { Listing } from "../types/listings.js";
import "dotenv/config";

export default class ListingsRepository {

  private asUser(accessToken: string) {
    return getSupabaseAnon(accessToken);
  }

  async getAllListings(accessToken: string): Promise<SupabaseQueryResult<Listing>[]> {
    const supabase = this.asUser(accessToken);
    const { data, error } = await supabase.from("listings").select("*");
    if (error) {
      throw error;
    }
    return data;
  }

  async getListingById(accessToken: string, listingId: string): Promise<SupabaseQueryResult<Listing>> {
    const supabase = this.asUser(accessToken);
    const { data, error } = await supabase.from("listings").select("*").eq("id", listingId).single();
    if (error) {
      throw error;
    }
    return data;
  }

  async getListingsByCategory(accessToken: string, category_id: string): Promise<SupabaseQueryResult<Listing>[]> {
    const supabase = this.asUser(accessToken);
    const { data, error } = await supabase.from("listings").select("*").eq("category_id", category_id);
    if (error) {
      throw error;
    }
    return data;
    }

    async getListingsByStatus(accessToken: string, status: string): Promise<SupabaseQueryResult<Listing>[]> {
    const supabase = this.asUser(accessToken);
    const { data, error } = await supabase.from("listings").select("*").eq("status", status);
    if (error) {
      throw error;
    }
    return data;
  }

  async createListing(accessToken: string, listingData: string): Promise<SupabaseQueryResult<Listing>> {
    const supabase = this.asUser(accessToken);
    const { data, error } = await supabase.from("listings").insert(listingData).single();
    if (error) {
      throw error;
    }
    return data;
  }

// Admin-level access
  async getListingsByUser(userId: string): Promise<SupabaseQueryResult<Listing>[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("listings").select("*").eq("seller_id", userId);
    if (error) {
      throw error;
    }
    return data;
  }
}
