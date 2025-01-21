import express from "express";
import http from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import homeRoutes from "./routes/index";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { initializeSocket } from "./sockets";

import "./config/passport";
import { errorHandler } from "./middleware/ErrorHandler";

// const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const server = http.createServer(app);

initializeSocket(server);

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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
