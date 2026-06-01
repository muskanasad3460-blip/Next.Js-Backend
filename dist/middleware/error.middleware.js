"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        error = new ApiError_1.ApiError(500, err.message || "Internal Server Error", false);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};
exports.errorHandler = errorHandler;
