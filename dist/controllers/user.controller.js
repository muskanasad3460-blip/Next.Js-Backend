"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = require("../utils/prisma");
// GET PROFILE
exports.getProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.user.id;
    const user = await prisma_1.prisma.user.findUnique({
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
exports.updateProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, bio } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updated = await prisma_1.prisma.user.update({
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
});
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
