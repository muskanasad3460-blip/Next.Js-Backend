"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidator = void 0;
const express_validator_1 = require("express-validator");
exports.addressValidator = [
    (0, express_validator_1.body)("country")
        .notEmpty()
        .withMessage("Country is required")
        .isString()
        .withMessage("Country must be a string"),
    (0, express_validator_1.body)("city")
        .notEmpty()
        .withMessage("City is required")
        .isString()
        .withMessage("City must be a string"),
    (0, express_validator_1.body)("postalCode")
        .notEmpty()
        .withMessage("Postal code is required")
        .isString()
        .withMessage("Postal code must be a string"),
    (0, express_validator_1.body)("taxId").optional().isString().withMessage("Tax ID must be a string"),
];
