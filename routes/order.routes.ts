// import express from "express";
// import {
//   cancelOrder,
//   createOrder,
//   deleteOrder,
//   getOrders,
//   getSingleOrder,
//   updateOrderStatus, // ✅ ADD THIS
// } from "../controllers/order.controller";

// const router = express.Router();

// router.post("/orders", createOrder);
// router.get("/orders", getOrders);

// // ✅ ADD THIS LINE (IMPORTANT)
// router.get("/orders/:id", getSingleOrder);
// router.put("/:id/status", updateOrderStatus);

// router.delete("/orders/:id", deleteOrder);
// router.patch("/orders/:id/cancel", cancelOrder);

// export default router;

import express from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders", getOrders);

router.get("/orders/:id", getSingleOrder);

router.put("/orders/:id/status", updateOrderStatus);

router.delete("/orders/:id", deleteOrder);

router.patch("/orders/:id/cancel", cancelOrder);

export default router;
