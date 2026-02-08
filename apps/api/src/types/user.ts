import type { UserRole } from "../enums/user.role.enum.js";
import type { UserStatus } from "../enums/user.status.enum.js";

export type User = {
    id: string;
    email: string;
    full_name: string;
    role: UserRole.USER | UserRole.ADMIN;
    verified: boolean;
    balance: number | 0;
    strike_count: number | 0;
    status: UserStatus.ACTIVE | UserStatus.INACTIVE | UserStatus.SUSPENDED | UserStatus.SUSPENDED ; // can log in/use the app | cannot log in/use the app | temporarily suspended | solf-deleted account (data retained for record-keeping)
    created_at: string;
    campus_region: string | null;
    zip_code: string | null;
    rating_avg: number | 0;
    rating_count: number | 0;
    avatar_url: string | null;
    phone_number: string | null;
};

export type PublicUser = {
    email: string;
    full_name: string;
    campus_region: string | null;
    avatar_url: string | null;
    phone_number: string | null;
}

export type UpdateUserInput = {
    full_name?: string | null;
    email?: string | null;
    campus_region?: string | null;
    avatar_url?: string | null;
    phone_number?: string | null;
};

export type AdminUpdateUserInput = {
  full_name?: string | null;
  role?: string | null;
  verified?: boolean | null;
  balance?: number | null;
  strike_count?: number | null;
  status?: string | null;
};
