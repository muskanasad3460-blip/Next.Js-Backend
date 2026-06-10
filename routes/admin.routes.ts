import express from "Express";
import { protect } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { analytics } from "../controllers/admin.controller";

const router = express.Router();

router.get("/admin/analytics", analytics);

export default router;
