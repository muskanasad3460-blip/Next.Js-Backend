"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// ======================
// CREATE PRODUCT
// ======================
// router.post("/", upload.single("image"), createProduct); // ======================
router.post("/", upload_1.upload.array("images", 10), product_controller_1.createProduct);
router.put("/:id", upload_1.upload.array("images", 10), product_controller_1.updateProduct);
// GET ALL PRODUCTS
// ======================
router.get("/", product_controller_1.getProducts);
// ======================
// SPECIAL ROUTES (IMPORTANT: must be BEFORE /:id)
// ======================
router.get("/flash-sale", product_controller_1.getFlashSaleProducts);
router.get("/best-selling", product_controller_1.getBestSellingProducts);
router.get("/explore", product_controller_1.getExploreProducts);
// ======================
// SEED
// ======================
// router.post("/seed", seedProducts);
// ======================
// SINGLE PRODUCT (MUST BE AFTER SPECIAL ROUTES)
// ======================
router.get("/:id", product_controller_1.getProduct);
// ======================
// UPDATE PRODUCT
// ======================
// router.put("/:id", upload.single("image"), updateProduct);
// ======================
// DELETE PRODUCT
// ======================
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
