import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";
import categories from "../src/data/categories";

//
// GET ALL CATEGORIES
//
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const where = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          products: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.category.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      categories: data,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  }
);

//
// SEED CATEGORIES
//

// export const seedCategories = asyncHandler(
//   async (req: Request, res: Response) => {
//     await prisma.category.deleteMany();
//     await prisma.category.createMany({
//       data: categories,
//     });
//     res.status(201).json({
//       message: "Category seeded successfully",
//     });
//   }
// );

export const seedCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (!admin) {
      res.status(400).json({
        message: "Admin user not found",
      });
      return;
    }

    await prisma.category.deleteMany();

    await prisma.category.createMany({
      data: categories.map((category) => ({
        name: category.name,
        icon: category.icon,

        userId: admin.id, // 👈 dynamic
      })),
    });

    res.status(201).json({
      message: "Category seeded successfully",
    });
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, icon, userId } = req.body;
    if (!name || !icon) {
      res.status(400).json({
        message: "Name and icon are required",
      });
      return;
    }
    const existing = await prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (existing) {
      res.status(400).json({
        message: "Category already exist",
      });
      return;
    }
    const category = await prisma.category.create({
      data: {
        name,
        icon,
        userId: Number(userId),
      },
    });
    res.status(201).json(category);
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { name, icon } = req.body;

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        icon,
      },
    });
    res.status(200).json(category);
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  }
);
