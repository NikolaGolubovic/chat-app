import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
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
  const user = req.user as any;
  res.cookie("jwt", user.token, { httpOnly: false, secure: process.env.NODE_ENV === "production" });
  res.status(200).json({ msg: "success", token: user.token });
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
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
