// import cors from "cors";
// import { configDotenv } from "dotenv";
// import express from "express";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import serverless from "serverless-http";
// import cookieSession from "cookie-session";
// import bodyParser from "body-parser";
// configDotenv();

// // db
// connectDB();

// // app
// const app = express();

// // middlewares
// app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 24 * 60 * 60 * 1000,
//   }),
// );

// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

// // routes
// app.use("/api/auth", authRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);

// if (process.env.NODE_ENV !== "production") {
//   app.listen(process.env.PORT, () => {
//     console.log(`Server started at ${process.env.PORT}`);
//   });
// }

// app.get("/", (req, res) => {
//   res.send("Backend is running!");
// });

// export default serverless(app);

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

let isConnected = false;
const connectDBOnce = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDBOnce();
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bharat-bazar-full.vercel.app"],
    credentials: true,
  }),
);

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default serverless(app);
