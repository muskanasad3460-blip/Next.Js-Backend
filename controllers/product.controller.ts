import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";
import { productSchema } from "../validation/product.validator";

const getId = (id: string | string[] | undefined) => {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
};

export const getFlashSaleProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isFlashSale: true },
    });

    res.json(products);
  }
);

export const getBestSellingProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isBestSale: true },
    });

    res.json(products);
  }
);

export const getExploreProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { isExplore: true },
    });

    res.json(products);
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
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

      const product = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          oldPrice: oldPrice ? Number(oldPrice) : null,
          discount: Number(discount),

          categoryId,
          brand,
          color,
          weight: Number(weight),
          length: Number(length),
          width: Number(width),
          description,
          rating: Number(rating),
          reviews: Number(reviews),
          badge,

          isFlashSale: productType === "flash",
          isBestSale: productType === "best",
          isExplore: productType === "explore",

          // MAIN IMAGE (optional)
          image: files?.[0] ? `/uploads/${files[0].filename}` : null,

          // MULTIPLE IMAGES (IMPORTANT FIX)
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

export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
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

    const shuffled = products.sort(() => Math.random() - 0.5);

    res.json(shuffled);
  }
);

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

export const updateProduct = asyncHandler(async (req: any, res) => {
  try {
    const id = req.params.id as string;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingProduct) {
      res.status(403).json({
        success: false,
        message: "You can update only your own products",
      });
      return;
    }

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

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        discount: Number(discount),
        description,
        categoryId,
        brand,
        color,
        weight: Number(weight),
        length: Number(length),
        width: Number(width),
        rating: Number(rating),
        reviews: Number(reviews),
        badge,

        isFlashSale: productType === "flash",
        isBestSale: productType === "best",
        isExplore: productType === "explore",
      },
    });

    if (files && files.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          productId: id,
        },
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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

// export const deleteProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const id = getId(req.params.id);

//     await prisma.product.delete({
//       where: { id },
//     });

//     res.json({
//       message: "Product Deleted",
//     });
//   }
// );
export const deleteProduct = asyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const id = getId(req.params.id);

    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!product) {
      res.status(403).json({
        success: false,
        message: "You can delete only your own products",
      });

      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Product Deleted",
    });
  }
);
