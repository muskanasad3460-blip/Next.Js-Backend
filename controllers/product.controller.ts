import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";

//create Product API
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, price, category, description, categoryId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        description,
        categoryId,
      },
    });
    res.status(201).json(product);
  }
);

// Get All Product

export const getProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  }
);
// Get single product

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json(product);
});

// Update Product
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, price, category, description } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        category,
        description,
      },
    });
    res.json(updated);
  }
);

// Delete product

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: "Product Deleted" });
  }
);
