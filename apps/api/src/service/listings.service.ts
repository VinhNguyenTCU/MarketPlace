import { ListingsRepository } from '../repository/listings.repository.js';
import type { ServiceOk, ServiceErr } from '../types/service.js';
import type { Listing } from '../types/listings.js';


export class ListingsService {
    private repo = new ListingsRepository();

    async getAllListings(accessToken: string): Promise<ServiceOk<any> | ServiceErr> {
        try {
            const data = await this.repo.getAllListings(accessToken);
            return { ok: true, data };
        } catch (error : any) {
            return { ok: false, status: 400, error: error.message };
        }
    }

    async getListingById(accessToken: string, listingId: string): Promise<ServiceOk<any> | ServiceErr> {
        try {
            const data = await this.repo.getListingById(accessToken, listingId);
            return { ok: true, data };
        } catch (error: any) {
            return { ok: false, status: 400, error: error.message };
        }
    }

    async getListingsByCategory(accessToken: string, category_id: string): Promise<ServiceOk<any> | ServiceErr> {   
        try {
            const data = await this.repo.getListingsByCategory(accessToken, category_id);
            return { ok: true, data };
        } catch (error: any) {
            return { ok: false, status: 400, error: error.message };
        }
    }

    async getListingsByStatus(accessToken: string, status: string): Promise<ServiceOk<any> | ServiceErr> {   
        try {
            const data = await this.repo.getListingsByStatus(accessToken, status);
            return { ok: true, data };
        } catch (error: any) {
            return { ok: false, status: 400, error: error.message };
        }
    }

    async createListing(accessToken: string, listingData: Partial<Listing>): Promise<ServiceOk<any> | ServiceErr> {   
        try {
            const data = await this.repo.createListing(accessToken, listingData);
            return { ok: true, data };
        } catch (error: any) {
            return { ok: false, status: 400, error: error.message };
        }
    }

    // Admin-level access
    async getListingsByUser(userId: string): Promise<ServiceOk<any> | ServiceErr> {   
        try {
            const data = await this.repo.getListingsByUser(userId);
            return { ok: true, data };
        } catch (error: any) {
            return { ok: false, status: 400, error: error.message };
        }
    }
}