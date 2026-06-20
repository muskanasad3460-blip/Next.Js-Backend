import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const protect =
  (...roles: string[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: "No token provided",
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      (req as any).user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: `Forbidden - Required roles: ${roles.join(", ")}`,
        });
        return;
      }

      next();
    } catch (error: any) {
      console.log("JWT ERROR:", error.message);

      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
  };
