"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
// SEED
router.post("/seed", category_controller_1.seedCategories);
// CATEGORY PRODUCTS
router.get("/:id/products", category_controller_1.getCategoryProducts);
// CRUD
router.post("/", category_controller_1.createCategory);
router.get("/", category_controller_1.getCategories);
router.put("/:id", category_controller_1.updateCategory);
router.delete("/:id", category_controller_1.deleteCategory);
exports.default = router;
