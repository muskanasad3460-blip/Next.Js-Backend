import asyncHandler from "express-async-handler";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { UserService } from "../services/user.service";

const service = new AuthService();
const userService = new UserService();

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  console.log({ user: req.user });
  res.json({
    // user, // ✅ wrap inside object
  });
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user.id;

  const { name, email, avatar } = req.body;

  const updated = await service.updateProfile(userId, {
    name,
    email,
    avatar,
  });
  res.json({ success: true, user: updated });
});
// export const updateUser = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   const { name, email } = req.body;

//   const updated = await prisma.user.update({
//     where: { id: userId },
//     data: {
//       name,
//       email,
//       image: req.file ? "uploaded-url-here" : undefined,
//     },
//   });

//   res.json({ user: updated });
// };

export const updateUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const { name, email } = req.body;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
  });

  return res.json({
    user: updated, // ✅ MUST return user
  });
};
