import { getSupabaseUser, getSupabaseAdmin } from "../supabase/client.js";
import "dotenv/config";

import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

type Listing = {
    id: string;
    seller_id: string;
    title: string;
    description: string;
    category_id: string;
    condition_id: string;
    price: string;
    is_free: boolean;
    status: string;
    location: string;
    created_at: string;
}

export class ListingsRepository {
  private asUser(accessToken: string) {
    return getSupabaseUser(accessToken);
  }

  async getAllListings(accessToken: string): Promise<PostgrestResponse<Listing>> {
    const supabase = this.asUser(accessToken);

    const res = await supabase.from("listings").select("*");

    if (res.error) throw res.error;
    return res;
  }

  async getListingById(
    accessToken: string,
    listingId: string
  ): Promise<PostgrestSingleResponse<Listing>> {
    const supabase = this.asUser(accessToken);

    const res = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (res.error) throw res.error;
    return res;
  }

  async getListingsByCategory(
    accessToken: string,
    category_id: string
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = this.asUser(accessToken);

    const res = await supabase
      .from("listings")
      .select("*")
      .eq("category_id", category_id);

    if (res.error) throw res.error;
    return res;
  }

  async getListingsByStatus(
    accessToken: string,
    status: string
  ): Promise<PostgrestResponse<Listing>> {
    const supabase = this.asUser(accessToken);

    const res = await supabase
      .from("listings")
      .select("*")
      .eq("status", status);

    if (res.error) throw res.error;
    return res;
  }

  async createListing(
    accessToken: string,
    listingData: Partial<Listing>
  ): Promise<PostgrestSingleResponse<Listing>> {
    const supabase = this.asUser(accessToken);

    const res = await supabase
      .from("listings")
      .insert(listingData)
      .select("*")
      .single();

    if (res.error) throw res.error;
    return res;
  }

  // Admin-level access
  async getListingsByUser(userId: string): Promise<PostgrestResponse<Listing>> {
    const supabase = getSupabaseAdmin();

    const res = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", userId);

    if (res.error) throw res.error;
    return res;
  }
}
