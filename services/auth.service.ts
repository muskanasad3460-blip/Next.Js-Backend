// import { prisma } from "../utils/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { ApiError } from "../utils/ApiError";

// export class AuthService {
//   async register(name: string, email: string, password: string) {
//     const userExists = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (userExists) {
//       throw new ApiError(400, "User already exists");
//     }

//     const saltRounds = process.env.SALT_ROUNDS;
//     if (!saltRounds) {
//       throw new ApiError(500, "SALT_ROUNDS not defined");
//     }

//     const hash = await bcrypt.hash(password, parseInt(saltRounds));

//     return await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hash,
//         role: "user", // 👈 default role
//       },
//     });
//   }

//   async login(email: string, password: string) {
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       throw new ApiError(400, "Invalid credentials");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       throw new ApiError(400, "Invalid credentials");
//     }

//     if (!process.env.JWT_SECRET) {
//       throw new ApiError(500, "JWT_SECRET is not defined");
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return {
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     };
//   }
// }

// ======================
// 👤 USER REGISTER
// ======================
// async registerUser(name: string, email: string, password: string) {
//   const existing = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (existing) {
//     throw new ApiError(400, "User already exists");
//   }

//   const hash = await bcrypt.hash(password, 10);

//   return prisma.user.create({
//     data: { name, email, password: hash },
//   });
// }

// // ======================
// // 👤 USER LOGIN
// // ======================
// async loginUser(email: string, password: string) {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) throw new ApiError(400, "Invalid credentials");

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw new ApiError(400, "Invalid credentials");

//   const token = jwt.sign(
//     { id: user.id, role: "user" },
//     process.env.JWT_SECRET!,
//     { expiresIn: "1d" }
//   );

//   return { user, token };
// }

// ======================
// 🛠 ADMIN REGISTER
// ======================
// async registerAdmin(name: string, email: string, password: string) {
//   const existing = await prisma.admin.findUnique({
//     where: { email },
//   });

//   if (existing) {
//     throw new ApiError(400, "Admin already exists");
//   }

//   const hash = await bcrypt.hash(password, 10);

//   return prisma.admin.create({
//     data: { name, email, password: hash },
//   });
// }
// ======================
// 🛠 ADMIN LOGIN
// ======================
//   async loginAdmin(email: string, password: string) {
//     const admin = await prisma.admin.findUnique({
//       where: { email },
//     });

//     if (!admin) throw new ApiError(400, "Invalid credentials");

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) throw new ApiError(400, "Invalid credentials");

//     const token = jwt.sign(
//       { id: admin.id, role: "admin" },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1d" }
//     );

//     return { admin, token };
//   }
// }

import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export class AuthService {
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

  async updateProfile(
    userId: string,
    data: { name?: string; email?: string; avatar?: string }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
