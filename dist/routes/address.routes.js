"use strict";
// import express from "express";
// import { protect } from "../middleware/auth.middleware";
// import { getAddress, upsertAddress } from "../controllers/address.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.get("/", protect, getAddress);
// router.put("/", protect, upsertAddress);
// export default router;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const address_controller_1 = require("../controllers/address.controller");
const address_validation_1 = require("../validation/address.validation");
const router = express_1.default.Router();
// GET ADDRESS
router.get("/", auth_middleware_1.protect, address_controller_1.getAddress);
// CREATE / UPDATE ADDRESS
router.put("/", auth_middleware_1.protect, address_validation_1.addressValidator, validate_1.validate, address_controller_1.upsertAddress);
exports.default = router;
