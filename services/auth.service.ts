import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  // ======================
  // USER REGISTER
  // ======================
  async registerUser(name: string, email: string, password: string) {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ApiError(400, "User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  // ======================
  // USER LOGIN
  // ======================
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET not defined");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  // ======================
  // ADMIN REGISTER
  // ======================
  async registerAdmin(name: string, email: string, password: string) {
    const exists = await prisma.admin.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ApiError(400, "Admin already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    return prisma.admin.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
  }

  // ======================
  // ADMIN LOGIN
  // ======================
  async loginAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new ApiError(400, "Only admin can login");
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET not defined");
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        type: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      admin: {
        id: admin.id,
        email: admin.email,
      },
      token,
    };
  }

  // ======================
  // UPDATE PROFILE
  // ======================
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      avatar?: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
