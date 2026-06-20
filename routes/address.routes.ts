import express from "express";

import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";

import { getAddress, upsertAddress } from "../controllers/address.controller";
import { addressValidator } from "../validation/address.validation";

const router = express.Router();

// GET ADDRESS
router.get("/", protect(), getAddress);

// CREATE / UPDATE ADDRESS
router.put("/", protect(), addressValidator, validate, upsertAddress);

export default router;
