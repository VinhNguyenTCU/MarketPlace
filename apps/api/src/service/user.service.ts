import { UserRepository } from "../repository/user.repository.js";
import type {
  User,
  UpdateUserInput,
  AdminUpdateUserInput,
  PublicUser,
} from "../types/user.js";

type ServiceError = {
  ok: false;
  status: number;
  error: string;
};

type ServiceSuccess<T> = {
  ok: true;
  data: T;
};

type ServiceResult<T> = ServiceError | ServiceSuccess<T>;

export class UserService {
  // --------- User scope ---------

  async getMyProfile(accessToken: string): Promise<ServiceResult<User>> {
    try {
      const profile = await UserRepository.getSelfByTokenAsUser(accessToken);
      return { ok: true, data: profile };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch profile";
      return { ok: false, status: 400, error: message };
    }
  }

  async updateMyProfile(
    accessToken: string,
    patch: UpdateUserInput
  ): Promise<ServiceResult<User>> {
    try {
      const updatedUser = await UserRepository.updateSelfByTokenAsUser(
        accessToken,
        patch
      );
      return { ok: true, data: updatedUser };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      return { ok: false, status: 400, error: message };
    }
  }

  async requestEmailChange(
    accessToken: string,
    newEmail: string
  ): Promise<ServiceResult<{ updated: true }>> {
    try {
      const result = await UserRepository.requestEmailChangeAsUser(
        accessToken,
        newEmail
      );
      return { ok: true, data: result };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to request email change";
      return { ok: false, status: 400, error: message };
    }
  }

  async deleteMyAccount(
    accessToken: string
  ): Promise<ServiceResult<{ deleted: true }>> {
    try {
      const result = await UserRepository.selfDeleteAccountAsUser(accessToken);
      return { ok: true, data: result };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete account";
      return { ok: false, status: 400, error: message };
    }
  }

  async searchUsersByName(
    accessToken: string,
    name: string,
    limit = 10
  ): Promise<ServiceResult<PublicUser[]>> {
    try {
      const users = await UserRepository.searchUsersByNameAsUser(
        accessToken,
        name,
        limit
      );
      return { ok: true, data: users };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to search users by name";
      return { ok: false, status: 400, error: message };
    }
  }

  async searchUsersByEmail(
    accessToken: string,
    email: string,
    limit = 10
  ): Promise<ServiceResult<PublicUser[]>> {
    try {
      const users = await UserRepository.searchUsersByEmailAsUser(
        accessToken,
        email,
        limit
      );
      return { ok: true, data: users };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to search users by email";
      return { ok: false, status: 400, error: message };
    }
  }

  async getUserById(
    accessToken: string,
    userId: string
  ): Promise<ServiceResult<PublicUser>> {
    try {
      const user = await UserRepository.getUserByIdAsUser(accessToken, userId);
      return { ok: true, data: user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch user";
      return { ok: false, status: 404, error: message };
    }
  }

  // --------- Admin scope ---------

  async getUserByIdAsAdmin(userId: string): Promise<ServiceResult<User>> {
    try {
      const user = await UserRepository.getUserByIdAsAdmin(userId);
      return { ok: true, data: user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch user";
      return { ok: false, status: 404, error: message };
    }
  }

  async updateUserByIdAsAdmin(
    userId: string,
    patch: AdminUpdateUserInput
  ): Promise<ServiceResult<User>> {
    try {
      const updatedUser = await UserRepository.updateUserByIdAsAdmin(
        userId,
        patch
      );
      return { ok: true, data: updatedUser };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";
      return { ok: false, status: 400, error: message };
    }
  }

  async softDeleteUserAsAdmin(
    userId: string
  ): Promise<ServiceResult<{ deleted: true }>> {
    try {
      const result = await UserRepository.softDeleteUserAsAdmin(userId);
      return { ok: true, data: result };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      return { ok: false, status: 400, error: message };
    }
  }
}