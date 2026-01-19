import { z } from "zod";

export const CreateListingSchema = z.object({
  title: z.string().min(1),
  price: z.number().nonnegative(),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  description: z.string().optional()
});
