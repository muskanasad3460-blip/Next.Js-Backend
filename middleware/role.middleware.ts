// export const isAdmin = (req: any, res: any, next: any) => {
//   if (req.user.type !== "admin") {
//     return res.status(403).json({ message: "Admin only" });
//   }
//   next();
// };

// export const isUser = (req: any, res: any, next: any) => {
//   if (req.user.type !== "user") {
//     return res.status(403).json({ message: "User only" });
//   }
//   next();
// };

import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

// export const authorize =
//   (...roles: Role[]) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     const userRole = req.user?.role as Role;

//     if (!roles.includes(userRole)) {
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }
//     console.log("User Role:", req.user.role);
//     console.log("Allowed Roles:", roles);

//     next();
//   };

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("REQ USER:", req.user);
    console.log("USER ROLE:", req.user?.role);
    console.log("ALLOWED:", roles);

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userRole = req.user.role as Role;

    console.log("User Role:", userRole);
    console.log("Allowed Roles:", roles);

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
