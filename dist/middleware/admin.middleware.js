"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const ApiError_1 = require("../utils/ApiError");
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    if (user.role !== "admin") {
        throw new ApiError_1.ApiError(403, "Admin only");
    }
    next();
};
exports.isAdmin = isAdmin;
