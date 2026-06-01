"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// import passport from "./middleware/passport";
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const address_routes_1 = __importDefault(require("./routes/address.routes"));
// import flashSaleRoutes from "./routes/flashSaleRoutes";
// import bestSellingRoutes from "./routes/bestSellingRoutes";
// import exploreProductsRoutes from "./routes/exploreProductsRoutes";
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// ✅ CORS
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://YOUR-FRONTEND.vercel.app",
    ],
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    // origin: "http://localhost:3000",
    credentials: true,
}));
// ✅ Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use((0, morgan_1.default)("dev"));
// app.use(passport.initialize());
// ✅ Static folders
app.use("/uploads", express_1.default.static("uploads"));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
// ✅ Routes (CLEAN STRUCTURE)
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api", order_routes_1.default);
app.use("/api/address", address_routes_1.default);
app.use("/api/orders", order_routes_1.default);
// app.use("/api/flash-sale", flashSaleRoutes);
// app.use("/api/best-selling", bestSellingRoutes);
// app.use("/api/explore", exploreProductsRoutes);
// ❌ REMOVE THIS (duplicate / wrong)
// app.use("/api", categoriesRoutes);
// ✅ Error handler LAST
app.use(error_middleware_1.errorHandler);
// 🚀 Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
