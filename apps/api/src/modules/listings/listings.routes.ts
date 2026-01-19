import { Router } from "express";
import { requireUser } from "../../middleware/requireUser.js";
import * as controller from "./listings.controller.js";

export const listingsRouter = Router();

listingsRouter.get("/", controller.list);
listingsRouter.post("/", requireUser, controller.create);
