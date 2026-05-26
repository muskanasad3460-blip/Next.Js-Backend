import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getAddress, upsertAddress } from "../controllers/address.controller";

const router = express.Router();

router.get("/", protect, getAddress);
router.put("/", protect, upsertAddress);

export default router;
