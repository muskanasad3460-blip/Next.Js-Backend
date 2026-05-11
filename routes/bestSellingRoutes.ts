import express from "express";
import { getBestSellingProducts } from "../controllers/bestSellingController";

const router = express.Router();

router.get("/best-selling-products", getBestSellingProducts);
export default router;
