import { PostgrestError } from "@supabase/supabase-js";

type ListingRepoResponse<T> = {
    status: number;
    statusText: string;
    data: T | null;
} | PostgrestError;

export type { ListingRepoResponse };

