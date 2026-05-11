import exploreProducts from "../src/data/exploreProducts";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const getExploreProducts = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(exploreProducts);
  }
);
