import { Router } from "express";
import * as VendorController from "../controllers/vendor.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();
/* ==========================
   Vendor Profile
========================== */

router.get(
  "/profile/me",
  protect(),
  authorize(Role.VENDOR),
  VendorController.getProfile
);

/* ==========================
   Admin Routes
========================== */
router.get(
  "/profile/analytics",
  protect(),
  authorize(Role.VENDOR),
  VendorController.vendorAnalytics
);

router.post(
  "/",
  protect(),
  authorize(Role.SUPER_ADMIN),
  VendorController.createVendor
);

router.get(
  "/",
  protect(),
  authorize(Role.SUPER_ADMIN),
  VendorController.getAllVendors
);

router.get(
  "/:id",
  protect(),
  authorize(Role.SUPER_ADMIN),
  VendorController.getVendor
);

router.put(
  "/:id",
  protect(),
  authorize(Role.SUPER_ADMIN),
  VendorController.updateVendor
);

router.delete(
  "/:id",
  protect(),
  authorize(Role.SUPER_ADMIN),
  VendorController.deleteVendor
);

export default router;

/* ==========================
   Admin Routes
========================== */

// router.post(
//   "/",
//   protect(),
//   authorize(Role.SUPER_ADMIN),
//   VendorController.createVendor
// );

// router.get(
//   "/",
//   protect(),
//   authorize(Role.SUPER_ADMIN),
//   VendorController.getAllVendors
// );

// router.get(
//   "/:id",
//   protect(),
//   authorize(Role.SUPER_ADMIN),
//   VendorController.getVendor
// );

// router.put(
//   "/:id",
//   protect(),
//   authorize(Role.SUPER_ADMIN),
//   VendorController.updateVendor
// );

// router.delete(
//   "/:id",
//   protect(),
//   authorize(Role.SUPER_ADMIN),
//   VendorController.deleteVendor
// );

// /* ==========================
//    Vendor Profile
// ========================== */

// router.get(
//   "/profile/me",
//   protect(),
//   authorize(Role.VENDOR),
//   VendorController.getProfile
// );
// ``
// export default router;
