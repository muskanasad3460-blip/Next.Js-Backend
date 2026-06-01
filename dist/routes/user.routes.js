"use strict";
// import express from "express";
// import { protect } from "../middleware/auth.middleware";
// import { upload } from "../middleware/upload";
// import {
//   getProfile,
//   updateProfile,
//   //   updateUser,
// } from "../controllers/user.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.get("/me", protect, getProfile);
// router.put("/profile", protect, upload.single("avatar"), updateProfile);
// export default router;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_1 = require("../middleware/upload");
const validate_1 = require("../middleware/validate");
const user_controller_1 = require("../controllers/user.controller");
const profile_validator_1 = require("../validation/profile.validator");
const router = express_1.default.Router();
// GET PROFILE
router.get("/me", auth_middleware_1.protect, user_controller_1.getProfile);
// UPDATE PROFILE
router.put("/profile", auth_middleware_1.protect, upload_1.upload.single("avatar"), profile_validator_1.profileValidator, validate_1.validate, user_controller_1.updateProfile);
exports.default = router;
