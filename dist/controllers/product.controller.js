"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = exports.getExploreProducts = exports.getBestSellingProducts = exports.getFlashSaleProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = require("../utils/prisma");
const product_validator_1 = require("../validation/product.validator");
//
// SAFE NUMBER
//
const toNumber = (val, fallback = 0) => {
    const num = Number(val);
    return Number.isFinite(num) ? num : fallback;
};
//
// SAFE ID
//
const getId = (id) => {
    if (!id)
        return "";
    return Array.isArray(id) ? id[0] : id;
};
//
// ======================
// FLASH SALE
// ======================
exports.getFlashSaleProducts = (0, express_async_handler_1.default)(async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        where: { isFlashSale: true },
    });
    res.json(products);
});
//
// ======================
// BEST SELLING
// ======================
exports.getBestSellingProducts = (0, express_async_handler_1.default)(async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        where: { isBestSale: true },
    });
    res.json(products);
});
//
// ======================
// EXPLORE
// ======================
exports.getExploreProducts = (0, express_async_handler_1.default)(async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        where: { isExplore: true },
    });
    res.json(products);
});
//
// ======================
// CREATE PRODUCT
// ======================
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        const files = req.files;
        const result = product_validator_1.productSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, price, oldPrice, discount, categoryId, brand, color, weight, length, width, description, rating, reviews, badge, productType, } = result.data;
        const product = await prisma_1.prisma.product.create({
            data: {
                name,
                price: toNumber(price),
                oldPrice: oldPrice ? toNumber(oldPrice) : null,
                // discount,
                categoryId,
                brand: brand || "",
                color: color || "",
                weight: toNumber(weight),
                length: toNumber(length),
                width: toNumber(width),
                rating: toNumber(rating),
                reviews: toNumber(reviews),
                badge: badge || "",
                description: description || "",
                isFlashSale: productType === "flash",
                isBestSale: productType === "best",
                isExplore: productType === "explore",
                // MAIN IMAGE
                image: files?.[0] ? `/uploads/${files[0].filename}` : null,
                // MULTIPLE IMAGES
                images: {
                    create: files?.map((file) => ({
                        url: `/uploads/${file.filename}`,
                    })) || [],
                },
            },
            include: {
                images: true,
                category: true,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
});
//
// ======================
// GET ALL PRODUCTS
// ======================
exports.getProducts = (0, express_async_handler_1.default)(async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
    });
    res.json(products);
});
//
// ======================
// GET SINGLE PRODUCT
// ======================
// export const getProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const id = getId(req.params.id);
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: { category: true },
//     });
//     if (!product) {
//       res.status(404).json({
//         message: "Product not found",
//       });
//       return;
//     }
//     res.json(product);
//   }
// );
//
// ======================
// GET SINGLE PRODUCT
// ======================
exports.getProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const id = getId(req.params.id);
    const product = await prisma_1.prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            // ✅ INCLUDE MULTIPLE IMAGES
            images: true,
        },
    });
    if (!product) {
        res.status(404).json({
            message: "Product not found",
        });
        return;
    }
    res.json(product);
});
//
// ======================
// UPDATE PRODUCT
// ======================
// export const updateProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const file = req.file as Express.Multer.File | undefined;
//     const id = getId(req.params.id);
//     const {
//       name,
//       price,
//       oldPrice,
//       discount,
//       description,
//       categoryId,
//       brand,
//       color,
//       weight,
//       length,
//       width,
//       rating,
//       reviews,
//       badge,
//       productType,
//     } = req.body;
//     const updated = await prisma.product.update({
//       where: { id },
//       data: {
//         name,
//         price: toNumber(price),
//         oldPrice: oldPrice ? toNumber(oldPrice) : null,
//         discount,
//         description,
//         categoryId,
//         brand,
//         color,
//         weight: toNumber(weight),
//         length: toNumber(length),
//         width: toNumber(width),
//         rating: toNumber(rating),
//         reviews: toNumber(reviews),
//         badge,
//         // ✅ ONLY ONE TRUE
//         isFlashSale: productType === "flash",
//         isBestSale: productType === "best",
//         isExplore: productType === "explore",
//         ...(file && {
//           image: `/uploads/${file.filename}`,
//         }),
//       },
//     });
//     res.json(updated);
//   }
// );
//
// ======================
// UPDATE PRODUCT
// ======================
exports.updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        const id = getId(req.params.id);
        const files = req.files;
        const { name, price, oldPrice, discount, description, categoryId, brand, color, weight, length, width, rating, reviews, badge, productType, } = req.body;
        // =========================
        // 1. UPDATE PRODUCT DATA
        // =========================
        const updated = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                name,
                price: toNumber(price),
                oldPrice: oldPrice ? toNumber(oldPrice) : null,
                discount,
                description,
                categoryId,
                brand,
                color,
                weight: toNumber(weight),
                length: toNumber(length),
                width: toNumber(width),
                rating: toNumber(rating),
                reviews: toNumber(reviews),
                badge,
                isFlashSale: productType === "flash",
                isBestSale: productType === "best",
                isExplore: productType === "explore",
            },
        });
        // =========================
        // 2. UPDATE IMAGES SAFELY
        // =========================
        if (files && files.length > 0) {
            // delete old images
            // await prisma.image.deleteMany({
            //   where: { productId: id },
            // });
            await prisma_1.prisma.productImage.deleteMany({
                where: { productId: id },
            });
            // create new images
            await prisma_1.prisma.productImage.createMany({
                data: files.map((file) => ({
                    url: `/uploads/${file.filename}`,
                    productId: id,
                })),
            });
        }
        // =========================
        // 3. RETURN UPDATED PRODUCT
        // =========================
        const finalProduct = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: true,
            },
        });
        res.json(finalProduct);
    }
    catch (error) {
        console.log("UPDATE PRODUCT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
});
//
// ======================
// DELETE PRODUCT
// ======================
exports.deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const id = getId(req.params.id);
    await prisma_1.prisma.product.delete({
        where: { id },
    });
    res.json({
        message: "Product Deleted",
    });
});
