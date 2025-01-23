import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { ensureAuthenticated } from "../middleware/authmiddleware";
import { register, login } from "../controllers/authController";
import { registerValidation, loginValidation } from "../validators/authValidators";
import { validationResult } from "express-validator";

const router = Router();

router.post("/register", registerValidation, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 400, errors: errors.array() });
  }
  register(req, res, next);
});

router.post("/login", loginValidation, (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 400, errors: errors.array() });
  }
  login(req, res, next);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email", "openid"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req: Request, res: Response) => {
  console.log("hello");
  const user = req.user as any;
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.SESSION_SECRET as string, { expiresIn: "1h" });
  res.cookie("jwt", token, { httpOnly: false, secure: process.env.NODE_ENV === "production" });
  res.redirect("http://localhost:5173");
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  console.log("nesto se desava");
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.send("This is a protected route");
});

export default router;
