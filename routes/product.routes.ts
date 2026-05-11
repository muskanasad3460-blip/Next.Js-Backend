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
  seedProducts,
} from "../controllers/product.controller";

import { upload } from "../middleware/upload";

const router = express.Router();

// NORMAL CRUD
router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

// FLASH SALE
router.get("/flash-sale", getFlashSaleProducts);

// BEST SELLING
router.get("/best-selling", getBestSellingProducts);

// EXPLORE
router.get("/explore", getExploreProducts);

// SEED
router.post("/seed", seedProducts);

export default router;
