// import { z } from "zod";

// const emptyToUndefined = (val: any) => (val === "" ? undefined : val);

// export const productSchema = z.object({
//   name: z.string().min(1, "Name is required"),

//   price: z.coerce.number().min(1, "Price is required"),

//   oldPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   discount: z.preprocess(emptyToUndefined, z.string().optional()),

//   categoryId: z.string().optional(),

//   description: z.preprocess(emptyToUndefined, z.string().optional()),

//   brand: z.preprocess(emptyToUndefined, z.string().optional()),

//   color: z.preprocess(emptyToUndefined, z.string().optional()),

//   weight: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   length: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   width: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   rating: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   reviews: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

//   badge: z.preprocess(emptyToUndefined, z.string().optional()),

//   productType: z.string().optional(),
// });

import { z } from "zod";

const emptyToUndefined = (val: any) => (val === "" ? undefined : val);

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),

  price: z.coerce.number().min(1, "Price is required"),

  // oldPrice: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

  // ✅ FIXED (number not string)
  discount: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

  // ⚠️ make required if Prisma requires it
  categoryId: z.string().min(1, "Category is required").trim(),
  description: z.preprocess(emptyToUndefined, z.string().optional()),

  brand: z.preprocess(emptyToUndefined, z.string().optional()),

  color: z.preprocess(emptyToUndefined, z.string().optional()),

  weight: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

  length: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

  width: z.preprocess(emptyToUndefined, z.coerce.number().optional()),

  oldPrice: z.coerce.number().optional().nullable(),
  rating: z.coerce.number().optional().nullable(),
  reviews: z.coerce.number().optional().nullable(),
  badge: z.string().optional().nullable(),

  // ⚠️ IMPORTANT FIX
  productType: z.string().optional(),
});
