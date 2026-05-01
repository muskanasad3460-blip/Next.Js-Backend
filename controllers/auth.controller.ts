import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

// type RegisterBody = {
//   name: string;
//   email: string;
//   password: string;
// };
// type LoginBody = {
//   email: string;
//   password: string;
// };

// export const register = asyncHandler(
//   async (req: Request<{}, {}, RegisterBody>, res: Response) => {
//     const { name, email, password } = req.body;

//     const user = await service.registerUser(name, email, password);

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   }
// );

// export const login = asyncHandler(
//   async (req: Request<{}, {}, LoginBody>, res: Response) => {
//     const { email, password } = req.body;

//     const data = await service.loginUser(email, password);

//     res.cookie("token", data.token, {
//       httpOnly: true,
//     });

//     res.json(data);
//   }
// );

// export const registerAdmin = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;

//     const admin = await service.registerAdmin(name, email, password);

//     res.json({
//       success: true,
//       admin,
//     });
//   }
// );

// export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const data = await service.loginAdmin(email, password);
//   res.json(data);
// });

// import asyncHandler from "express-async-handler";
// import { Request, Response } from "express";
// import { AuthService } from "../services/auth.service";

// const service = new AuthService();

// /* ======================
//    ADMIN REGISTER
// ====================== */
// export const registerAdmin = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;

//     const admin = await service.registerAdmin(name, email, password);

//     res.status(201).json({
//       success: true,
//       data: admin,
//     });
//   }
// );

// /* ======================
//    ADMIN LOGIN
// ====================== */
// export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const data = await service.loginAdmin(email, password);

//   res.cookie("token", data.token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false, // set true in production HTTPS
//   });

//   res.status(200).json({
//     success: true,
//     ...data,
//   });
// });

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const admin = await service.registerAdmin(name, email, password);

  res.json({ success: true, admin });
});

// export const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const data = await service.loginAdmin(email, password);

//   res.json(data);
// });
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await service.loginAdmin(email, password);

  // ✅ SET COOKIE (IMPORTANT FIX)
  res.cookie("jwt", `Bearer ${data.token}`, {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    success: true,
    user: data.admin,
  });
});
