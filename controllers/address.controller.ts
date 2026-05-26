import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

// GET USER ADDRESS
export const getAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const address = await prisma.address.findFirst({
    where: { userId },
  });

  res.json({ success: true, address });
});

// CREATE OR UPDATE ADDRESS (1 per user)
export const upsertAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const { country, city, postalCode, taxId } = req.body;

    const address = await prisma.address.upsert({
      where: {
        userId, // need unique index (see below)
      },
      update: {
        country,
        city,
        postalCode,
        taxId,
      },
      create: {
        userId,
        country,
        city,
        postalCode,
        taxId,
      },
    });

    res.json({
      success: true,
      address,
    });
  }
);
