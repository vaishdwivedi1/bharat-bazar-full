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

// Add request logging middleware FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Connect to database
let dbConnectionPromise = connectDB().catch(err => {
  console.error("Failed to connect to database:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Database connection middleware with error handling
app.use(async (req, res, next) => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }
    await dbConnectionPromise;
    console.log("Database connection verified for request");
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

// Test routes FIRST to ensure they work
app.get("/", (req, res) => {
  console.log("Root endpoint hit");
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

app.get("/api/health", (req, res) => {
  console.log("Health check endpoint hit");
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "API is working correctly!" });
});

// Your actual routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error in request:", err);
  console.error("Error stack:", err.stack);
  res.status(500).json({ 
    error: "Something broke!",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Create the serverless handler
const handler = serverless(app);

// Export the handler directly
export default handler;
