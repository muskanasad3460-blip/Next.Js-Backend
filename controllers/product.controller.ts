// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import { prisma } from "../utils/prisma";
// import { file } from "zod";
// import { productSchema } from "../validation/product.validator";

// export const createProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const file = req.file as Express.Multer.File;

//     const result = productSchema.safeParse(req.body);

//     if (!result.success) {
//       res.status(400).json({
//         success: false,
//         errors: result.error.flatten().fieldErrors,
//       });
//       return;
//     }
//     console.log("BODY:", req.body);

//     const {
//       name,
//       price,
//       categoryId,
//       brand,
//       color,
//       weight,
//       length,
//       width,
//       description,
//     } = result.data;

//     const product = await prisma.product.create({
//       data: {
//         name,
//         price: Number(price),
//         categoryId,

//         brand: brand || "",
//         color: color || "",

//         weight: Number(weight || 0),
//         length: Number(length || 0),
//         width: Number(width || 0),

//         description: description || "",
//         image: file ? `/uploads/${file.filename}` : null,
//       },
//     });

//     res.status(201).json(product);
//   }
// );

// export const getProducts = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const products = await prisma.product.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         category: true,
//       },
//     });

//     res.json({
//       products,
//     });
//   }
// );

// export const getProduct = asyncHandler(async (req: Request, res: Response) => {
//   const id = req.params.id as string;
//   const product = await prisma.product.findUnique({
//     where: { id },
//   });
//   if (!product) {
//     res.status(404).json({ message: "Product not found" });
//     return;
//   }
//   res.json(product);
// });

// export const updateProduct = asyncHandler(
//   async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     const {
//       name,
//       price,
//       description,
//       categoryId,
//       brand,
//       color,
//       weight,
//       length,
//       width,
//     } = req.body;

//     const updated = await prisma.product.update({
//       where: { id },
//       data: {
//         name,
//         price: Number(price),
//         description,
//         categoryId,

//         brand,
//         color,

//         weight: weight ? Number(weight) : 0,
//         length: length ? Number(length) : 0,
//         width: width ? Number(width) : 0,

//         ...(req.file && {
//           image: `/uploads/${req.file.filename}`,
//         }),
//       },
//     });

//     res.json(updated);
//   }
// );

// // Delete product

// export const deleteProduct = asyncHandler(
//   async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     await prisma.product.delete({
//       where: { id },
//     });
//     res.json({ message: "Product Deleted" });
//   }
// );

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";

// import products from "../src/data/products";

import { productSchema } from "../validation/product.validator";

//
// FLASH SALE PRODUCTS
//

export const getFlashSaleProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: {
        isFlashSale: true,
      },
    });

    res.status(200).json(products);
  }
);

//
// BEST SELLING PRODUCTS
//

export const getBestSellingProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: {
        isBestSale: true,
      },
    });

    res.status(200).json(products);
  }
);

//
// EXPLORE PRODUCTS
//

export const getExploreProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: {
        isExplore: true,
      },
    });

    res.status(200).json(products);
  }
);

//
// SEED PRODUCTS
//

export const seedProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await prisma.product.count();

    res.status(200).json({
      message: "Dynamic DB mode active",
      totalProducts: count,
    });
  }
);

//
// CREATE PRODUCT
//

export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File;

    const result = productSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
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
      isFlashSale,
      isBestSale,
      isExplore,
    } = result.data;

    const product = await prisma.product.create({
      data: {
        name,

        price,
        oldPrice,
        discount,

        categoryId,

        brand: brand || "",
        color: color || "",

        weight: Number(weight || 0),
        length: Number(length || 0),
        width: Number(width || 0),

        rating: Number(rating || 0),
        reviews: Number(reviews || 0),

        badge: badge || "",

        isFlashSale: Boolean(isFlashSale),
        isBestSale: Boolean(isBestSale),
        isExplore: Boolean(isExplore),

        description: description || "",

        image: file ? `/uploads/${file.filename}` : null,
      },
    });

    res.status(201).json(product);
  }
);

//
// GET ALL PRODUCTS
//

export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: true,
      },
    });

    res.json(products);
  }
);

//
// GET SINGLE PRODUCT
//

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      category: true,
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
// UPDATE PRODUCT
//

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

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
      isFlashSale,
      isBestSale,
      isExplore,
    } = req.body;

    const updated = await prisma.product.update({
      where: {
        id,
      },

      data: {
        name,

        price,
        oldPrice,
        discount,

        description,

        categoryId,

        brand,
        color,

        weight: weight ? Number(weight) : 0,
        length: length ? Number(length) : 0,
        width: width ? Number(width) : 0,

        rating: rating ? Number(rating) : 0,
        reviews: reviews ? Number(reviews) : 0,

        badge,

        isFlashSale: Boolean(isFlashSale),
        isBestSale: Boolean(isBestSale),
        isExplore: Boolean(isExplore),

        ...(req.file && {
          image: `/uploads/${req.file.filename}`,
        }),
      },
    });

    res.json(updated);
  }
);

//
// DELETE PRODUCT
//

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product Deleted",
    });
  }
);
