import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import homeRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { errorHandler } from "./middleware/ErrorHandler";
import "./config/passport";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize routes
// setRoutes(app);

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
