import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export class AuthService {
  async loginVendor(email: string, password: string) {
    const vendor = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Email received:", email);
    console.log("Vendor from DB:", vendor);

    if (!vendor) {
      throw new Error("Invalid email or password");
    }

    console.log("Role:", vendor.role);

    if (vendor.role !== Role.VENDOR) {
      throw new Error("Vendor access only");
    }

    const isMatch = await bcrypt.compare(password, vendor.password);

    console.log("Entered Password:", password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    return { vendor };
  }
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
      role: user.role,
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
        role: user.role,
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
        role: user.role,
      },
      token,
    };
  }
  async registerAdmin(name: string, email: string, password: string) {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ApiError(400, "Admin already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    return prisma.user.create({
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
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new ApiError(400, "Admin not found");
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Only SUPER_ADMIN can login
    if (admin.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Admin access only");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET not defined");
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        type: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    };
  }

  // ======================
  // UPDATE PROFILE
  // ======================
  async updateProfile(
    userId: number,
    data: {
      name?: string;
      email?: string;
      avatar?: string;
    }
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}
