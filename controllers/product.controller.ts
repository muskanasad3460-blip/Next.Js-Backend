import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";
import { productSchema } from "../validation/product.validator";

//
// SAFE NUMBER
//
const toNumber = (val: any, fallback = 0) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

//
// SAFE ID
//
const getId = (id: string | string[] | undefined) => {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
};

//
// ======================
// FLASH SALE
// ======================
export const getFlashSaleProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isFlashSale: true },
    });

    res.json(products);
  }
);

//
// ======================
// BEST SELLING
// ======================
export const getBestSellingProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isBestSale: true },
    });

    res.json(products);
  }
);

//
// ======================
// EXPLORE
// ======================
export const getExploreProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isExplore: true },
    });

    res.json(products);
  }
);

//
// ======================
// CREATE PRODUCT
// ======================

// export const createProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       // ✅ SINGLE FILE ONLY
//       const file = req.file as Express.Multer.File | undefined;

//       const result = productSchema.safeParse(req.body);

//       if (!result.success) {
//         res.status(400).json({
//           success: false,
//           errors: result.error.flatten().fieldErrors,
//         });
//         return;
//       }

//       const {
//         name,
//         price,
//         oldPrice,
//         discount,
//         categoryId,
//         brand,
//         color,
//         weight,
//         length,
//         width,
//         description,
//         rating,
//         reviews,
//         badge,
//         productType,
//       } = result.data;

//       const product = await prisma.product.create({
//         data: {
//           name,

//           price: toNumber(price),
//           oldPrice: oldPrice ? toNumber(oldPrice) : null,
//           discount,

//           categoryId,

//           brand: brand || "",
//           color: color || "",

//           weight: toNumber(weight),
//           length: toNumber(length),
//           width: toNumber(width),

//           rating: toNumber(rating),
//           reviews: toNumber(reviews),

//           badge: badge || "",

//           isFlashSale: productType === "flash",
//           isBestSale: productType === "best",
//           isExplore: productType === "explore",

//           description: description || "",

//           // ✅ SINGLE IMAGE ONLY
//           image: file ? `/uploads/${file.filename}` : null,
//         },

//         include: {
//           category: true,
//         },
//       });

//       res.status(201).json(product);
//     } catch (error) {
//       console.log("CREATE PRODUCT ERROR:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create product",
//       });
//     }
//   }
// );
export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);
      const files = req.files as Express.Multer.File[];

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
        productType,
      } = result.data;

      const product = await prisma.product.create({
        data: {
          name,

          price: toNumber(price),

          oldPrice: oldPrice ? toNumber(oldPrice) : null,

          discount,

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
            create:
              files?.map((file) => ({
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
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to create product",
      });
    }
  }
);

//
// ======================
// GET ALL PRODUCTS
// ======================
export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    res.json(products);
  }
);

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
export const getProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getId(req.params.id);

    const product = await prisma.product.findUnique({
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
  }
);

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
export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const id = getId(req.params.id);

      const files = req.files as Express.Multer.File[] | undefined;

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

      // =========================
      // 1. UPDATE PRODUCT DATA
      // =========================
      const updated = await prisma.product.update({
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
        await prisma.image.deleteMany({
          where: { productId: id },
        });

        // create new images
        await prisma.image.createMany({
          data: files.map((file) => ({
            url: `/uploads/${file.filename}`,
            productId: id,
          })),
        });
      }

      // =========================
      // 3. RETURN UPDATED PRODUCT
      // =========================
      const finalProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
        },
      });

      res.json(finalProduct);
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update product",
      });
    }
  }
);

//
// ======================
// DELETE PRODUCT
// ======================
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = getId(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Product Deleted",
    });
  }
);
