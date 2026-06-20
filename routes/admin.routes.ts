import express from "express";
import { analytics } from "../controllers/admin.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/analytics", protect("SUPER_ADMIN"), analytics);

export default router;
