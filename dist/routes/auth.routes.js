"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
// ==========================
// USER ROUTES
// ==========================
router.post("/send-otp", auth_controller_1.sendOtp);
router.post("/verify-otp", auth_controller_1.verifyOtp);
router.post("/login", auth_controller_1.login);
// ==========================
// ADMIN ROUTES
// ==========================
router.post("/admin/register", auth_controller_1.registerAdmin);
router.post("/admin/login", auth_controller_1.loginAdmin);
// ==========================
// ADMIN PROTECTED
// ==========================
router.get("/admin/dashboard", auth_middleware_1.protect, admin_middleware_1.isAdmin, (req, res) => {
    res.json({
        message: "Welcome admin dashboard",
    });
});
exports.default = router;
