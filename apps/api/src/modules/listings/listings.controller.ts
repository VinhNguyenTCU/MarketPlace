import type { Request, Response } from "express";
import * as service from "./listings.service.js";

export async function create(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const listing = await service.createListing(user.id, req.body);
    res.status(201).json(listing);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function list(_req: Request, res: Response) {
  const listings = await service.getListings();
  res.json(listings);
}
