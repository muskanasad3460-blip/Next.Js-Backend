import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.get("/admin/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome admin dashboard" });
});
// router.post("/register", validate(registerSchema), register);

// router.post("/login", validate(loginSchema), login);
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

export default router;
