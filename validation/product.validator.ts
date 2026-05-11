import { z } from "zod";

const emptyToUndefined = (val: any) => (val === "" ? undefined : val);

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),

  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), "Price must be a number"),

  oldPrice: z.preprocess(emptyToUndefined, z.string().optional()),

  discount: z.preprocess(emptyToUndefined, z.string().optional()),

  categoryId: z.string().optional(),

  description: z.preprocess(emptyToUndefined, z.string().optional()),

  brand: z.preprocess(emptyToUndefined, z.string().optional()),

  color: z.preprocess(emptyToUndefined, z.string().optional()),

  weight: z.preprocess(emptyToUndefined, z.string().optional()),

  length: z.preprocess(emptyToUndefined, z.string().optional()),

  width: z.preprocess(emptyToUndefined, z.string().optional()),

  rating: z.preprocess(emptyToUndefined, z.string().optional()),

  reviews: z.preprocess(emptyToUndefined, z.string().optional()),

  badge: z.preprocess(emptyToUndefined, z.string().optional()),

  isFlashSale: z.boolean().optional(),

  isBestSale: z.boolean().optional(),

  isExplore: z.boolean().optional(),
});
