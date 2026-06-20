import express from "express";

import {
  login,
  loginAdmin,
  logoutUser,
  registerAdmin,
  // registerAdmin,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = express.Router();

// ==========================
// USER ROUTES
// ==========================
router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/login", login);

// ==========================
// ADMIN ROUTES
// ==========================
router.post("/admin/register", registerAdmin);

router.post("/admin/login", loginAdmin);

// ==========================
// ADMIN PROTECTED
// ==========================
router.get("/admin/dashboard", protect(), isAdmin, (req, res) => {
  res.json({
    message: "Welcome admin dashboard",
  });
});

router.post("/logout", logoutUser);

export default router;
