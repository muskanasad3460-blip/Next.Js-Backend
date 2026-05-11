import express from "express";
import {
  getFlashSaleProducts,
  seedFlashSaleProducts,
} from "../controllers/flashSaleController";

const router = express.Router();

// GET products (frontend uses this)
router.get("/flash-sale-products", getFlashSaleProducts);

// SEED products (Postman uses this)
router.post("/seed-flash-sale-products", seedFlashSaleProducts);

export default router;
