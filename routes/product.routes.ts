import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  getFlashSaleProducts,
  getBestSellingProducts,
  getExploreProducts,
} from "../controllers/product.controller";

import { upload } from "../middleware/upload";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * IMPORTANT: specific routes FIRST
 */

// FILTER ROUTES
router.get("/flash-sale", getFlashSaleProducts);
router.get("/best-selling", getBestSellingProducts);
router.get("/explore", getExploreProducts);

/**
 * GET ALL PRODUCTS
 */
router.get("/", getProducts);

/**
 * GET SINGLE PRODUCT
 */
router.get("/:id", getProduct);

/**
 * CREATE PRODUCT
 */
router.post("/", protect(), upload.array("images", 10), createProduct);

/**
 * UPDATE PRODUCT
 */
router.put("/:id", protect(), upload.array("images", 10), updateProduct);

/**
 * DELETE PRODUCT
 */
router.delete("/:id", protect(), deleteProduct);

export default router;
