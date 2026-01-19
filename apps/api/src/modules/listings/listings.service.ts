import { CreateListingSchema } from "./listings.schema.js";
import * as repo from "./listings.repo.js";

export function createListing(userId: string, body: unknown) {
  const input = CreateListingSchema.parse(body);
  return repo.insertListing(userId, input);
}

export function getListings() {
  return repo.listListings();
}
