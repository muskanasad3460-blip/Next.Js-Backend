"use strict";
// import { Request, Response, NextFunction } from "express";
// import { ObjectSchema } from "joi";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
// export const validate =
//   (schema: ObjectSchema) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     const { error } = schema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });
//     if (error) {
//       return res.status(400).json({
//         message: "Validation error",
//         errors: error.details.map((d) => d.message),
//       });
//     }
//     next();
//   };
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};
exports.validate = validate;
