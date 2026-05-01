import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Admin only");
  }

  next();
};
