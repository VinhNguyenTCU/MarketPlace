import { supabase } from "../../db/supabase.js";

export async function insertListing(ownerId: string, data: any) {
  const { data: row, error } = await supabase
    .from("listings")
    .insert([{ ...data, owner_id: ownerId }])
    .select()
    .single();

  if (error) throw error;
  return row;
}

export async function listListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
