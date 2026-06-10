import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import adminRoutes from "./routes/admin.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ✅ CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://next-js-frontend-nu.vercel.app",
//     ],
//     // origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],

    credentials: true,
  })
);

// app.options(
//   /.*/,
//   cors({
//     origin: "*",
//   })
// );

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("dev"));

// ✅ Static folders
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));

// ✅ Routes (CLEAN STRUCTURE)
// app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", orderRoutes);

app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", adminRoutes);

// ✅ Error handler LAST
app.use(errorHandler);

// 🚀 Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
