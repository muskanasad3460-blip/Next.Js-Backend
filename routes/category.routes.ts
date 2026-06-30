import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
  seedCategories,
} from "../controllers/category.controller";

import { protect } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/", protect(), getCategories);

// Get single category
router.get("/:id", protect(), getCategory);

// Seed categories
router.post("/seed", protect(Role.SUPER_ADMIN), seedCategories);

router.post("/", protect(Role.SUPER_ADMIN, Role.VENDOR), createCategory);

router.put("/:id", protect(Role.SUPER_ADMIN, Role.VENDOR), updateCategory);

router.delete("/:id", protect(Role.SUPER_ADMIN, Role.VENDOR), deleteCategory);

export default router;
