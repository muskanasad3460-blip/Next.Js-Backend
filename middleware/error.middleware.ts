import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, err.message || "Internal Server Error", false);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
