import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import categories from "../src/data/categories";
import { prisma } from "../utils/prisma";

// GET ALL CATEGORIES
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await prisma.category.findMany();

    res.status(200).json({
      categories: data,
    });
  }
);

// SEED CATEGORIES (RUN ONCE)
export const seedCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await prisma.category.count();

    if (count > 0) {
      res.status(200).json({ message: "Already seeded" });
      return;
    }

    await prisma.category.createMany({
      data: categories,
    });

    res.status(201).json({
      message: "Categories seeded successfully",
    });
  }
);
