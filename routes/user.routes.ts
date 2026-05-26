import express from "express";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";
import {
  getProfile,
  updateProfile,
  //   updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
