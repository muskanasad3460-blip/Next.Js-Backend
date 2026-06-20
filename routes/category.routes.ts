import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  seedCategories,
} from "../controllers/category.controller";

const router = express.Router();

// SEED
router.post("/seed", seedCategories);

// CATEGORY PRODUCTS
// CRUD
router.post("/", createCategory);

router.get("/", getCategories);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
