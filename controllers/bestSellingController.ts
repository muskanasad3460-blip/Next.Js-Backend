import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bestSellingProducts from "../src/data/bestSellingProducts";
import { prisma } from "../utils/prisma";

export const getBestSellingProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.status(200).json(bestSellingProducts);
  }
);
