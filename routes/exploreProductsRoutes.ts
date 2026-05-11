import express from "express";
import { getExploreProducts } from "../controllers/EXPLOREproductsController";
const router = express.Router();

router.get("/explore-products", getExploreProducts);

export default router;
