import { z } from "zod";

export const CreateCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive()
});

export const changeQuantitySchema = z.object({
  quantity: z.number().positive()
});
