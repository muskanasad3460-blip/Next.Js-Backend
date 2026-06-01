"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidator = void 0;
const express_validator_1 = require("express-validator");
exports.profileValidator = [
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 2, max: 10 })
        .withMessage("Name must be at least 2 characters"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("phone").optional().isString().withMessage("Phone must be a string"),
    (0, express_validator_1.body)("bio")
        .optional()
        .isString()
        .withMessage("Bio must be a string")
        .isLength({ max: 200 })
        .withMessage("Bio must be under 200 characters"),
];
