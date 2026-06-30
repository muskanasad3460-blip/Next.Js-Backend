import { Role } from "@prisma/client";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";

export const createVendor = async (data: any) => {
  const exists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (exists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      avatar: data.avatar,
      bio: data.bio,
      role: Role.VENDOR,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getAllVendors = async () => {
  return prisma.user.findMany({
    where: {
      role: Role.VENDOR,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getVendor = async (id: number) => {
  return prisma.user.findFirst({
    where: {
      id,
      role: Role.VENDOR,
      deletedAt: null,
    },
  });
};

export const updateVendor = async (id: number, data: any) => {
  let password = undefined;

  if (data.password) {
    password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      bio: data.bio,
      ...(password && { password }),
    },
  });
};

export const deleteVendor = async (id: number) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
