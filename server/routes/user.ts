import { NextFunction, Request, Response, Router } from "express";
import { changePassword, resetPassword, resetPasswordPage, setPasswordController } from "../controllers/userController";
import { setPasswordValidation } from "../validators/authValidators";
import { validationResult } from "express-validator";
import { handleValidationErrors } from "../utils/helpers";

const router = Router();

router.get("/reset/password/:reset", resetPasswordPage);
router.post("/reset-password-initialize", resetPassword);
router.post("/reset-form", changePassword);
router.post("/set-password", setPasswordValidation, handleValidationErrors, setPasswordController);

export default router;
