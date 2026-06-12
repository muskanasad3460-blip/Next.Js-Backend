import { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = "qasim@gmail.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }
  const hashedPassword = await bcrypt.hash("1234567", 10);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("Admin created succesfully");
}
async function main() {
  try {
    await seedAdmin();
  } catch (error) {
    console.error(error);
  }

  await prisma.$disconnect();
}

main();
