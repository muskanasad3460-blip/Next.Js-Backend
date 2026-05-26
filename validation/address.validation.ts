import { body } from "express-validator";

export const addressValidator = [
  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  body("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isString()
    .withMessage("Postal code must be a string"),

  body("taxId").optional().isString().withMessage("Tax ID must be a string"),
];
