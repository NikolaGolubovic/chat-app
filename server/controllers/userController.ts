import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "../config/nodemailer";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    throw Error("Please provide email");
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Error("User not found");
    }
    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
    console.log("token", token);
    const resetUrl = `http://localhost:3000/user/reset/password/${token}`;
    await sendEmail(email, "Password Reset", `Reset your password using this link: ${resetUrl}`);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordPage = async (req: Request, res: Response, next: NextFunction) => {
  const resetPasswordToken = req.params.reset;
  if (!resetPasswordToken) {
    throw Error("Something went wrong");
  }
  try {
    const user = await prisma.user.findUnique({ where: { resetPasswordToken } });
    if (!user?.resetPasswordToken) {
      throw Error("Something went wrong, please try again.");
    }
    if (user?.resetPasswordExpires && new Date(user?.resetPasswordExpires) < new Date(Date.now())) {
      throw Error("Your confirmation link is expired.");
    }
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    next(error);
  }
};

export const setPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    if ((error as any).code === "P2025") {
      next({ message: "User not found." });
    }
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, resetPasswordToken } = req.body;
  if (!password) {
    return next(new Error("Please provide a new password."));
  }
  if (!resetPasswordToken) {
    return next(new Error("Invalid or missing reset token."));
  }
  try {
    const user = await prisma.user.findUnique({ where: { resetPasswordToken } });
    if (!user) {
      return next(new Error("Invalid or expired reset token."));
    }
    if (user.resetPasswordExpires && new Date(user.resetPasswordExpires) < new Date()) {
      return next(new Error("Reset token has expired."));
    }

    const newPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { resetPasswordToken },
      data: {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    res.status(200).send("Password has been changed successfully.");
  } catch (error) {
    next(error);
  }
};
