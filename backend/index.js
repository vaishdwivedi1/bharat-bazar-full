import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import serverless from "serverless-http";
import cookieSession from "cookie-session";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

configDotenv();

const app = express();

// Connect to database once at startup
let dbConnectionPromise = connectDB();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bharat-bazar-full.vercel.app"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
);

app.use(express.urlencoded({ extended: true }));

// Wait for database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await dbConnectionPromise;
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

export default serverless(app);
