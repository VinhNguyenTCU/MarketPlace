import { ListingStatus } from "../enums/listing.status.enum.js";
import { UserStatus } from "../enums/user.status.enum.js";
import {
    getSupabaseUserClient,
    getSupabaseAdminClient,
} from "../supabase/client.js";
import type {
    User,
    UpdateUserInput,
    AdminUpdateUserInput,
    PublicUser,
} from "../types/user.js";

const PUBLIC_USER_SELECT = "id, full_name, email, avatar_url, zip_code, campus_region, rating_avg, rating_count, phone_number";

export const UserRepository = {
    // ------ User scope -------
    asUser(accessToken: string) {
        return getSupabaseUserClient(accessToken);
    },

    /**
    * Exposed so controller/service can call this ONCE per request
    * and pass selfId around (avoid repeated auth calls).
    */
    async requireSelfId(accessToken: string): Promise<string> {
        const supabase = this.asUser(accessToken);

        const { data: authData, error: authErr } = await supabase.auth.getUser();

        if (authErr || !authData?.user) {
            throw new Error(authErr?.message ?? "Not authenticated");
        }

        return authData.user.id;
    },

    async searchUsersByNameAsUser(accessToken: string, name: string, limit = 10): Promise<PublicUser[]> {

        const query = name.trim();
        if (!query) return [];

        const supabase = this.asUser(accessToken);
        const { data, error } = await supabase
            .from("users")
            .select(PUBLIC_USER_SELECT)
            .neq("status", UserStatus.DELETED) // hide deleted accounts
            .ilike("full_name", `%${query}%`)
            .order("full_name", { ascending: true })
            .limit(limit);

        if (error) throw new Error(error.message);
        return (data ?? []) as PublicUser[];
    },

    async getUserByIdAsUser(accessToken: string, userId: string): Promise<PublicUser> {
        const supabase = this.asUser(accessToken);

        const { data, error } = await supabase
            .from("users")
            .select(PUBLIC_USER_SELECT)
            .eq("id", userId)
            .neq("status", UserStatus.DELETED) // hide deleted accounts
            .single();

        if (error) throw new Error(error.message);
        return data as PublicUser;
    },

    async searchUsersByEmailAsUser(accessToken: string, email: string, limit = 10): Promise<PublicUser[]> {
        const query = email.trim();
        if (!query) return [];

        const supabase = this.asUser(accessToken);

        const { data, error } = await supabase
            .from("users")
            .select("full_name, email, avatar_url, zip_code, campus_region, rating_avg, rating_count, phone_number")
            .neq("status", UserStatus.DELETED)
            .ilike("email", query) // exact-ish (case-insensitive)
            .order("email", { ascending: true })
            .limit(limit);

        if (error) throw new Error(error.message);
        return (data ?? []) as PublicUser[];
    },

    async selfDeleteAccountAsUser(accessToken: string): Promise<{ deleted: true }> {
        const supabase = this.asUser(accessToken);
        const selfId = await this.requireSelfId(accessToken);

        const { error: userErr } = await supabase
            .from("users")
            .update({ status: UserStatus.DELETED })
            .eq("id", selfId)
            .single();

        if (userErr) throw new Error(userErr.message);

        const { error: listingErr } = await supabase
            .from("listings")
            .update({ status: ListingStatus.INACTIVE }) // hide their listings (but keep them for record-keeping)
            .eq("owner_id", selfId);

        if (listingErr) throw new Error(listingErr.message);

        return { deleted: true };
    },

    async getSelfByTokenAsUser(accessToken: string): Promise<User> {
        const supabase = this.asUser(accessToken);
        const userId = await this.requireSelfId(accessToken);

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    },

    /**
    * IMPORTANT: Do NOT allow updating email here.
    * Email changes should go through Supabase Auth (verification + consistency).
    */
    async updateSelfByTokenAsUser(
        accessToken: string,
        patch: UpdateUserInput,
    ): Promise<User> {
        const supabase = this.asUser(accessToken);
        const selfId = await this.requireSelfId(accessToken);

        const update: UpdateUserInput = {};
        if ("full_name" in patch) update.full_name = patch.full_name ?? null;
        if ("campus_region" in patch)
            update.campus_region = patch.campus_region ?? null;
        if ("phone_number" in patch)
            update.phone_number = patch.phone_number ?? null;
        if ("avatar_url" in patch) update.avatar_url = patch.avatar_url ?? null;

        const { data, error } = await supabase
            .from("users")
            .update(update)
            .eq("id", selfId)
            .select("*")
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    },

    /**
   * Email change flow via Supabase Auth.
   * This keeps auth.users and your profile consistent.
   *
   * Note: Supabase may require email verification depending on your project settings.
   */
    async requestEmailChangeAsUser(
        accessToken: string,
        newEmail: string,
    ): Promise<{ updated: true }> {
        const supabase = this.asUser(accessToken);

        const email = newEmail.trim();
        if (!email) throw new Error("Email is required");

        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw new Error(error.message);

        return { updated: true };
    }
    ,
    // ------ Admin scope -------
    asAdmin() {
        return getSupabaseAdminClient();
    },

    async getUserByIdAsAdmin(userId: string): Promise<User> {
        const supabase = this.asAdmin();

        const { data, error } = await supabase 
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        
        if (error) throw new Error(error.message);
        return data as User;
    },

    async updateUserByIdAsAdmin(userId: string, patch: AdminUpdateUserInput): Promise<User> {
        const supabase = this.asAdmin();

        const { data, error } = await supabase
            .from("users")
            .update(patch)
            .eq("id", userId)
            .select("*")
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    },

    async softDeleteUserAsAdmin(userId: string): Promise<{ deleted: true }> {
        const supabase = this.asAdmin();

        const { error: userErr } = await supabase
            .from("users")
            .update({
                status: UserStatus.DELETED,
            })
            .eq("id", userId)
            .single();

        if (userErr) throw new Error(userErr.message);
            
        // Also mark their listings as inactive (but keep them for record-keeping)
        const { error: listingErr } = await supabase
            .from("listings")
            .update({ status: ListingStatus.INACTIVE })
            .eq("owner_id", userId);
        
        if (listingErr) throw new Error(listingErr.message);

        return { deleted: true };
    }
}