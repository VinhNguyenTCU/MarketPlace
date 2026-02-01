import { ProfileRepository } from "../repository/profile.repository.js";

type ServiceOk<T> = { ok: true; data: T };
type ServiceErr = { ok: false; status: number; error: string };

export class ProfileService {
  private repo = new ProfileRepository();

  async getMyProfile(accessToken: string): Promise<ServiceOk<any> | ServiceErr> {
    const { data, error } = await this.repo.getMe(accessToken);
    if (error) return { ok: false, status: 400, error: error.message };
    return { ok: true, data };
  }
}