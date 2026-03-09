import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserRepository } from "../repository/user.repository.js";
import { ListingStatus } from "../enums/listing.status.enum.js";
import { UserStatus } from "../enums/user.status.enum.js";
import {
  getSupabaseAdminClient,
  getSupabaseUserClient,
} from "../supabase/client.js";

vi.mock("../supabase/client.js", () => ({
  getSupabaseUserClient: vi.fn(),
  getSupabaseAdminClient: vi.fn(),
}));

describe("UserRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireSelfId", () => {
    it("returns current user id when token is valid", async () => {
      (getSupabaseUserClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-1" } },
            error: null,
          }),
        },
      });

      await expect(UserRepository.requireSelfId("good-token")).resolves.toBe("user-1");
    });

    it("throws when auth returns no user", async () => {
      (getSupabaseUserClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "bad token" },
          }),
        },
      });

      await expect(UserRepository.requireSelfId("bad-token")).rejects.toThrow("bad token");
    });
  });

  describe("searchUsersByNameAsUser", () => {
    it("returns [] and skips Supabase call for blank query", async () => {
      const result = await UserRepository.searchUsersByNameAsUser("token", "   ");

      expect(result).toEqual([]);
      expect(getSupabaseUserClient).not.toHaveBeenCalled();
    });

    it("uses trimmed name and returns data", async () => {
      const limit = vi.fn().mockResolvedValue({
        data: [{ id: "u1", full_name: "Test User" }],
        error: null,
      });
      const order = vi.fn().mockReturnValue({ limit });
      const ilike = vi.fn().mockReturnValue({ order });
      const neq = vi.fn().mockReturnValue({ ilike });
      const select = vi.fn().mockReturnValue({ neq });
      const from = vi.fn().mockReturnValue({ select });

      (getSupabaseUserClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        from,
      });

      const result = await UserRepository.searchUsersByNameAsUser("token", "  tes  ", 5);

      expect(from).toHaveBeenCalledWith("users");
      expect(ilike).toHaveBeenCalledWith("full_name", "%tes%");
      expect(limit).toHaveBeenCalledWith(5);
      expect(result).toEqual([{ id: "u1", full_name: "Test User" }]);
    });
  });

  describe("requestEmailChangeAsUser", () => {
    it("throws when new email is blank", async () => {
      await expect(UserRepository.requestEmailChangeAsUser("token", "  ")).rejects.toThrow(
        "Email is required",
      );
    });

    it("calls supabase auth.updateUser with trimmed email", async () => {
      const updateUser = vi.fn().mockResolvedValue({ error: null });

      (getSupabaseUserClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { updateUser },
      });

      await expect(
        UserRepository.requestEmailChangeAsUser("token", "  test@tcu.edu  "),
      ).resolves.toEqual({ updated: true });
      expect(updateUser).toHaveBeenCalledWith({ email: "test@tcu.edu" });
    });
  });

  describe("softDeleteUserAsAdmin", () => {
    it("marks user deleted and listings inactive", async () => {
      const userSingle = vi.fn().mockResolvedValue({ error: null });
      const userEq = vi.fn().mockReturnValue({ single: userSingle });
      const userUpdate = vi.fn().mockReturnValue({ eq: userEq });

      const listingEq = vi.fn().mockResolvedValue({ error: null });
      const listingUpdate = vi.fn().mockReturnValue({ eq: listingEq });

      const from = vi.fn((table: string) => {
        if (table === "users") return { update: userUpdate };
        if (table === "listings") return { update: listingUpdate };
        throw new Error(`Unexpected table: ${table}`);
      });

      (getSupabaseAdminClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        from,
      });

      await expect(UserRepository.softDeleteUserAsAdmin("u-1")).resolves.toEqual({
        deleted: true,
      });

      expect(userUpdate).toHaveBeenCalledWith({ status: UserStatus.DELETED });
      expect(userEq).toHaveBeenCalledWith("id", "u-1");
      expect(listingUpdate).toHaveBeenCalledWith({ status: ListingStatus.INACTIVE });
      expect(listingEq).toHaveBeenCalledWith("owner_id", "u-1");
    });
  });
});
