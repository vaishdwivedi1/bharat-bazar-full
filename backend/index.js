import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
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

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT}`);
});
