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
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        console.log(profile.id);
        let user = await prisma.user.findUnique({ where: { email } });
        if (user && !user.googleId) {
          await prisma.user.update({
            where: {
              email,
            },
            data: {
              googleId: profile.id,
            },
          });
        }
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: email || "",
              username: profile.displayName,
            },
          });
        }
        done(null, user);
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
