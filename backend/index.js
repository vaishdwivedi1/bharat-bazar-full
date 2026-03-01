import connectDB from "./config/db.js";
import express, { json } from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
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
