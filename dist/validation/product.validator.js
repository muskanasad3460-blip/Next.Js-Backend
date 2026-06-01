"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
const emptyToUndefined = (val) => (val === "" ? undefined : val);
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    price: zod_1.z.coerce.number().min(1, "Price is required"),
    oldPrice: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    discount: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    categoryId: zod_1.z.string().optional(),
    description: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    brand: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    color: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    weight: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    length: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    width: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    rating: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    reviews: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number().optional()),
    badge: zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional()),
    productType: zod_1.z.string().optional(),
});
