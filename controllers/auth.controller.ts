import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

const service = new AuthService();

/* =========================
   OTP STORE
========================= */
const otpStore = new Map<
  string,
  {
    otp: string;
    name: string;
    password: string;
    expires: number;
  }
>();

/* =========================
   EMAIL CONFIG
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   SEND OTP
========================= */
export const sendOtp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, password required",
      });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      name,
      password,
      expires: Date.now() + 5 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
      <div>
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      </div>
    `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  }
);

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const data = otpStore.get(email);

    if (!data) {
      res.status(400).json({
        success: false,
        message: "OTP not found",
      });
      return;
    }

    if (Date.now() > data.expires) {
      otpStore.delete(email);

      res.status(400).json({
        success: false,
        message: "OTP expired",
      });
      return;
    }

    if (data.otp !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    const user = await service.registerUser(data.name, email, data.password);

    otpStore.delete(email);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "user",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      user,
      token,
    });
  }
);

/* =========================
   LOGIN USER
========================= */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const data = await service.loginUser(email, password);

    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        type: "user",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      user: data.user,
      token,
    });

    return;
  }
);

/* =========================
   ADMIN REGISTER
========================= */
// export const registerAdmin = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       res.status(400).json({
//         success: false,
//         message: "Name, email, password required",
//       });
//       return;
//     }

//     const admin = await service.registerAdmin(name, email, password);

//     res.status(201).json({
//       success: true,
//       admin,
//     });

//     return;
//   }
// );

/* =========================
   ADMIN LOGIN
========================= */
export const loginAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const data = await service.loginAdmin(email, password);

    const token = jwt.sign(
      {
        id: data.admin.id,
        email: data.admin.email,
        type: "admin",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      user: data.admin,
      token,
    });

    return;
  }
);
