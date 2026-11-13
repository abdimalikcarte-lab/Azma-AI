
import express from "express";

import {
  sendChatMessage
} from "../controllers/chatController.js";

import {
  authenticateUser
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Send message to AZMA AI
router.post(
  "/",
  authenticateUser,
  sendChatMessage
);

export default router;
