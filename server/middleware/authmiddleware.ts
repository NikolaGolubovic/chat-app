import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  const token = req.cookies.jwt;
  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw Error("Some problem with login");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      throw new Error("Invalid Token");
    }
  }
};
