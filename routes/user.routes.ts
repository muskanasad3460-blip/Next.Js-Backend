import express from "express";
import {
  getProfile,
  updateProfile,
  updateUser,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";
const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/update", protect, upload.single("image"), updateUser);
router.post("/update", protect, updateProfile);

export default router;
