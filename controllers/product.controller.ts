import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";
import { productSchema } from "../validation/product.validator";

interface Params {
  id: string;
}

type TypedRequest = Request<Params>;

/**
 * SAFE NUMBER CONVERTER
 */
const toNumber = (val: any) => (val === "" || val == null ? null : Number(val));

/**
 * GET FLASH SALE
 */
export const getFlashSaleProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isFlashSale: true },
    include: {
      images: true,
    },
  });

  res.json(products);
});

/**
 * GET BEST SELLING
 */
export const getBestSellingProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isBestSale: true },
  });

  res.json(products);
});

/**
 * GET EXPLORE
 */
export const getExploreProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isExplore: true },
  });

  res.json(products);
});

/**
 * CREATE PRODUCT
 */
export const createProduct = asyncHandler(async (req: any, res) => {
  const files = req.files as Express.Multer.File[];

  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten(),
    });
    return;
  }

  const {
    name,
    price,
    oldPrice,
    discount,
    categoryId,
    brand,
    color,
    weight,
    length,
    width,
    description,
    rating,
    reviews,
    badge,
    productType,
  } = result.data;
  console.log("AUTH USER:", req.user);
  console.log("USER ID:", req.user?.id);

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      oldPrice: toNumber(oldPrice),
      discount: toNumber(discount) || 0,

      categoryId,
      userId: req.user?.id,

      brand,
      color,

      weight: toNumber(weight),
      length: toNumber(length),
      width: toNumber(width),

      description,

      rating: toNumber(rating),
      reviews: toNumber(reviews),
      badge,

      isFlashSale: productType === "flash",
      isBestSale: productType === "best",
      isExplore: productType === "explore",

      images: {
        create:
          files?.map((file) => ({
            url: `/uploads/${file.filename}`,
          })) || [],
      },
    },
  });

  res.status(201).json(product);
});

/**
 * GET ALL PRODUCTS
 */
export const getProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.json(products.sort(() => Math.random() - 0.5));
});

/**
 * GET SINGLE PRODUCT
 */
export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
});

/**
 * UPDATE PRODUCT
 */
export const updateProduct = asyncHandler(async (req: any, res) => {
  const id = req.params.id;
  const files = req.files as Express.Multer.File[];

  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== req.user.id) {
    res.status(403).json({
      success: false,
      message: "Not allowed",
    });
    return;
  }

  const {
    name,
    price,
    oldPrice,
    discount,
    description,
    categoryId,
    brand,
    color,
    weight,
    length,
    width,
    rating,
    reviews,
    badge,
    productType,
  } = req.body;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      price: Number(price),
      oldPrice: toNumber(oldPrice),
      discount: toNumber(discount),

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

  if (files?.length) {
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    await prisma.productImage.createMany({
      data: files.map((file) => ({
        url: `/uploads/${file.filename}`,
        productId: id,
      })),
    });
  }

  const finalProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  res.json(finalProduct);
});

/**
 * DELETE PRODUCT
 */
export const deleteProduct = asyncHandler(async (req: any, res) => {
  const id = req.params.id;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.userId !== req.user.id) {
    res.status(403).json({
      success: false,
      message: "Not allowed",
    });
    return;
  }

  await prisma.productImage.deleteMany({
    where: { productId: id },
  });

  await prisma.product.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "Product deleted",
  });
});
