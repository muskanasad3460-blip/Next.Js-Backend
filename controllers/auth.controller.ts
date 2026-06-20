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
    COOKIE OPTIONS
  ========================= */
const cookieOptions = {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

/* =========================
    SEND OTP
  ========================= */
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
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
    html: `<h1>${otp}</h1><p>Valid for 5 minutes</p>`,
  });

  res.json({
    success: true,
    message: "OTP sent successfully",
  });
});

/* =========================
    VERIFY OTP (COOKIE LOGIN)
  ========================= */
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const data = otpStore.get(email);

  if (!data) {
    res.status(400).json({ success: false, message: "OTP not found" });
    return;
  }

  if (Date.now() > data.expires) {
    otpStore.delete(email);
    res.status(400).json({ success: false, message: "OTP expired" });
    return;
  }

  if (data.otp !== otp) {
    res.status(400).json({ success: false, message: "Invalid OTP" });
    return;
  }

  const user = await service.registerUser(data.name, email, data.password);

  otpStore.delete(email);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: "user",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // ✅ SET COOKIE HERE
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    user,
  });
});

/* =========================
    LOGIN USER (COOKIE)
  ========================= */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await service.loginUser(email, password);

  const token = jwt.sign(
    {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      type: "user",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // ✅ COOKIE SET
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user: data.user,
  });
});

/* =========================
    ADMIN REGISTER (COOKIE OPTIONAL)
  ========================= */
export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, password required",
      });
      return;
    }

    const admin = await service.registerAdmin(name, email, password);

    res.status(201).json({
      success: true,
      admin,
    });
  }
);

/* =========================
    ADMIN LOGIN (COOKIE)
  ========================= */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await service.loginAdmin(email, password);

  const token = jwt.sign(
    {
      id: data.admin.id,
      email: data.admin.email,
      role: data.admin.role,
      type: "admin",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // ✅ COOKIE SET
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user: data.admin,
  });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
