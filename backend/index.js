import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serverless from "serverless-http";
configDotenv();

// db
connectDB();

// app
const app = express();
app.use(cors());

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default serverless(app);
