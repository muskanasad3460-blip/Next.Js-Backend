import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

// CREATE

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Category name required" });
      return;
    }

    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  }
);
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.json({ category });
  }
);

// GET ALL CATEGORIES

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "5", search = "" } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: String(search),
          mode: "insensitive",
        },
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.category.count({
      where: {
        name: {
          contains: String(search),
          mode: "insensitive",
        },
      },
    });
    res.json({
      categories,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    });
  }
);

// DELETE CATEGORIES

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await prisma.category.delete({
      where: { id },
    });
    res.json({ message: "Category Deleted" });
  }
);
