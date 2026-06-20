import express from "express";

import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";

import { getProfile, updateProfile } from "../controllers/user.controller";

import { profileValidator } from "../validation/profile.validator";

const router = express.Router();

// GET PROFILE
router.get("/me", protect(), getProfile);

// UPDATE PROFILE
router.put(
  "/profile",
  protect(),
  upload.single("avatar"),
  profileValidator,
  validate,
  updateProfile
);

export default router;
