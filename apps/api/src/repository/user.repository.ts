import { UserStatus } from "../enums/user.status.enum.js";
import {
    getSupabaseAdminClient,
    getSupabaseUserClient,
} from "../supabase/client.js";
import type {
    User,
    UpdateUserInput,
    AdminUpdateUserInput,
    PublicUser,
} from "../types/user.js";

export class UserRepository {
    // ------ User scope -------
    private asUser(accessToken: string) {
        return getSupabaseUserClient(accessToken);
    }

    private async requireSelfId(accessToken: string): Promise<string> {
        const supabase = this.asUser(accessToken);

        const { data: authData, error: authErr } = await supabase.auth.getUser();

        if (authErr || !authData?.user) {
            throw new Error(authErr?.message ?? "Not authenticated");
        }

        return authData.user.id;
    }

    async searchUsersByNameAsUser(accessToken: string, name: string, limit = 10): Promise<PublicUser[]> {

        const query = name.trim();
        if (!query) return [];

        const supabase = this.asUser(accessToken);
        const { data, error } = await supabase
            .from("users")
            .select("full_name, email, avatar_url, zip_code, campus_region, rating_avg, rating_count, phone_number")
            .neq("status", UserStatus.DELETED) // hide deleted accounts
            .ilike("full_name", `%${query}%`)
            .order("full_name", { ascending: true })
            .limit(limit);

        if (error) throw new Error(error.message);
        return (data ?? []) as PublicUser[];
    }

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
    }

    async selfDeleteAccountAsUser(accessToken: string): Promise<{ deleted: true }> {
        const supabase = this.asUser(accessToken);
        const selfId = await this.requireSelfId(accessToken);

        const { error } = await supabase
            .from("users")
            .update({ status: UserStatus.DELETED })
            .eq("id", selfId)
            .single();

        if (error) throw new Error(error.message);
        return { deleted: true };
    }

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
    }

    async updateSelfByTokenAsUser(
        accessToken: string,
        patch: UpdateUserInput,
    ): Promise<User> {
        const supabase = this.asUser(accessToken);
        const userId = await this.requireSelfId(accessToken);

        const update: UpdateUserInput = {};
        if ("full_name" in patch) update.full_name = patch.full_name ?? null;
        if ("email" in patch) update.email = patch.email ?? null;
        if ("campus_region" in patch)
            update.campus_region = patch.campus_region ?? null;
        if ("phone_number" in patch)
            update.phone_number = patch.phone_number ?? null;
        if ("avatar_url" in patch) update.avatar_url = patch.avatar_url ?? null;

        const { data, error } = await supabase
            .from("users")
            .update(update)
            .eq("id", userId)
            .select("*")
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    }
    // ------ Admin scope -------

    async softDeleteUserAsAdmin(userId: string): Promise<{ deleted: true }> {
        const supabase = getSupabaseAdminClient();

        const { error } = await supabase
            .from("users")
            .update({
                status: UserStatus.DELETED,
            })
            .eq("id", userId)
            .single();
        if (error) throw new Error(error.message);

        return { deleted: true };
    }
}
