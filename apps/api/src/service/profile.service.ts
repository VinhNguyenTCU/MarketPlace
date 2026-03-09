import { UserRepository } from "../repository/user.repository.js";

type ServiceError = {
  ok: false;
  status: number;
  error: string;
};

type ServiceSuccess<T> = {
  ok: true;
  data: T;
};

export class ProfileService {
  async getMyProfile(accessToken: string): Promise<ServiceError | ServiceSuccess<unknown>> {
    try {
      const profile = await UserRepository.getSelfByTokenAsUser(accessToken);
      return { ok: true, data: profile };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch profile";
      return { ok: false, status: 400, error: message };
    }
  }
}
