// filora-backend/src/server.ts

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/route";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 5000;

// Middleware Setup
app.use(cors()); // CORS allow karne ke liye
app.use(express.json());
app.use(cookieParser()); // Body parser: JSON requests ko handle karne ke liye
app.use("/", router);

// Test Route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from filora server",
  });
});

// Server Start
app.listen(PORT, () => {
  console.log(`⚡️ Server is running on http://localhost:${PORT}`);
});
