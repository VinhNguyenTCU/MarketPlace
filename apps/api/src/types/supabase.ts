import { PostgrestError } from "@supabase/supabase-js";

type SupabaseQueryResult<T> = {
    status: number;
    statusText: string;
    data: T | null;
} | PostgrestError;

export type { SupabaseQueryResult };

