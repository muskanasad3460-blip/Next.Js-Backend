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
  // seedProducts,
} from "../controllers/product.controller";

import { upload } from "../middleware/upload";

const router = express.Router();

// ======================
// CREATE PRODUCT
// ======================
// router.post("/", upload.single("image"), createProduct); // ======================
router.post("/", upload.array("images", 10), createProduct);

router.put("/:id", upload.array("images", 10), updateProduct);
// GET ALL PRODUCTS
// ======================
router.get("/", getProducts);

// ======================
// SPECIAL ROUTES (IMPORTANT: must be BEFORE /:id)
// ======================
router.get("/flash-sale", getFlashSaleProducts);
router.get("/best-selling", getBestSellingProducts);
router.get("/explore", getExploreProducts);

// ======================
// SEED
// ======================
// router.post("/seed", seedProducts);

// ======================
// SINGLE PRODUCT (MUST BE AFTER SPECIAL ROUTES)
// ======================
router.get("/:id", getProduct);

// ======================
// UPDATE PRODUCT
// ======================
// router.put("/:id", upload.single("image"), updateProduct);

// ======================
// DELETE PRODUCT
// ======================
router.delete("/:id", deleteProduct);

export default router;
