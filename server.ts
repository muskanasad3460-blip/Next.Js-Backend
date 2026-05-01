import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import passport from "./middleware/passport";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  cookieParser(
    "98c638c3fef79ddc2dda332fba9c3d12c4431033599e5084afb64c0c1dadeace8ff5f87bb8af978284ac558b866a6b1a79488c5b8a3cf6320bea24c0e8f3c830"
  )
);
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ MUST BE LAST
app.use(errorHandler);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
