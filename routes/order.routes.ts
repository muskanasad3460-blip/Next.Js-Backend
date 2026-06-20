import express from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/order.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/orders", protect(), createOrder);

router.get("/orders", protect(), getOrders);

router.get("/orders/:id", protect(), getSingleOrder);

router.put("/orders/:id/status", protect(), updateOrderStatus);

router.delete("/orders/:id", protect(), deleteOrder);

router.patch("/orders/:id/cancel", protect(), cancelOrder);

export default router;
