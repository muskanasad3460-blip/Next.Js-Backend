import { body } from "express-validator";

export const profileValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("phone").optional().isString().withMessage("Phone must be a string"),

  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 200 })
    .withMessage("Bio must be under 200 characters"),
];
