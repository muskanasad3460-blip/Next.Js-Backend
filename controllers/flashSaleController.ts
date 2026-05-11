import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import flashSaleProducts from "../src/data/flashSaleProducts";
import { prisma } from "../utils/prisma";

export const getFlashSaleProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await prisma.flashSaleProduct.findMany();

    res.status(200).json(products);
  }
);

export const seedFlashSaleProducts = asyncHandler(
  async (req: Request, res: Response) => {
    await prisma.flashSaleProduct.deleteMany();

    await prisma.flashSaleProduct.createMany({
      data: flashSaleProducts,
    });

    res.status(201).json({
      message: "Flash sale products reseeded successfully",
    });
  }
);
