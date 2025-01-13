import { body } from "express-validator";

export const registerValidation = [
  body("username").isString().withMessage("Username must be a string").trim().escape(),
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").trim().escape(),
];

export const loginValidation = [
  body("username").optional().isString().withMessage("Username must be a string").trim().escape(),
  body("email").optional().isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").trim().escape(),
];

export const setPasswordValidation = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").trim().escape(),
];
