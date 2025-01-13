import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log("user", user);
    res.status(201).send("User registered");
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  try {
    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error("There is no such user, please register account");
    }
    if (!process.env.SESSION_SECRET) {
      throw new Error("Some problem with logging");
    }
    const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET);
    res.cookie("jwt", token, { httpOnly: true, secure: false }); // Set secure to true if using HTTPS
    res.send("Login successful");
  } catch (error) {
    next(error);
  }
};
