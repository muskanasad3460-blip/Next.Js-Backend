import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

// GET PROFILE
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
    },
  });

  res.json({
    success: true,
    user,
  });
});

// UPDATE PROFILE
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const { name, email, phone, bio } = req.body;

    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        bio,
        ...(avatar && { avatar }),
      },
    });

    res.json({
      success: true,
      user: updated,
    });
  }
);
// export const updateUser = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   const { name, email, phone, bio } = req.body;

//   const image = req.file?.filename
//     ? `/uploads/${req.file.filename}`
//     : undefined;

//   const updated = await prisma.user.update({
//     where: { id: userId },
//     data: {
//       name,
//       email,
//       phone,
//       bio,
//       avatar: image || undefined,
//     },
//   });

//   res.json({
//     success: true,
//     user: updated,
//   });
// };
