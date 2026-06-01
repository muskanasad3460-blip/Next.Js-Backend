"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post("/orders", order_controller_1.createOrder);
router.get("/orders", order_controller_1.getOrders);
// ✅ ADD THIS LINE (IMPORTANT)
router.get("/orders/:id", order_controller_1.getSingleOrder);
router.put("/:id/status", order_controller_1.updateOrderStatus);
router.delete("/orders/:id", order_controller_1.deleteOrder);
router.patch("/orders/:id/cancel", order_controller_1.cancelOrder);
exports.default = router;
