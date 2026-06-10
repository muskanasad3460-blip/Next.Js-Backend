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
  // getMyProducts,
  // seedProducts,
} from "../controllers/product.controller";

import { upload } from "../middleware/upload";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.delete("/:id", protect, deleteProduct);
// router.post("/", upload.array("images", 10), createProduct);
router.post("/", upload.array("images", 10), createProduct);
router.put("/:id", upload.array("images", 10), updateProduct);

// router.put("/:id", upload.array("images", 10), updateProduct);

router.get("/", getProducts);
// router.get("/my-products", protect, getMyProducts);

router.get("/flash-sale", getFlashSaleProducts);
router.get("/best-selling", getBestSellingProducts);
router.get("/explore", getExploreProducts);

router.get("/:id", getProduct);

// router.delete("/:id", deleteProduct);

export default router;
