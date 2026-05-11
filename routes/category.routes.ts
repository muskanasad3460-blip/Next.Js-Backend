import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoryProducts,
  seedCategories,
} from "../controllers/category.controller";

const router = express.Router();

// SEED
router.post("/seed", seedCategories);

// CATEGORY PRODUCTS
router.get("/:id/products", getCategoryProducts);
// CRUD
router.post("/", createCategory);

router.get("/", getCategories);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
