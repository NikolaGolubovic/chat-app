import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: email || "",
              username: profile.displayName,
            },
          });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SESSION_SECRET as string, { expiresIn: "1h" });
        done(null, { user, token });
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
