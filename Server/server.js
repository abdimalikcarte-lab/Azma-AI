
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json({ limit: "1mb" }));

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AZMA AI API is running successfully",
    application: "AZMA AI",
    status: "healthy"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// AI Chat routes
app.use("/api/chat", chatRoutes);

// Conversation routes
app.use("/api/conversations", conversationRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to AZMA AI - Intelligent Conversational Platform");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AZMA AI server running on port ${PORT}`);
});
