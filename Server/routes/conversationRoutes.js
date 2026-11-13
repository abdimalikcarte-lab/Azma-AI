
import express from "express";

import {
  getConversations,
  getConversationMessages,
  deleteConversation
} from "../controllers/conversationController.js";

import {
  authenticateUser
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all conversations belonging to the logged-in user
router.get(
  "/",
  authenticateUser,
  getConversations
);

// Get messages from a specific conversation
router.get(
  "/:id/messages",
  authenticateUser,
  getConversationMessages
);

// Delete a specific conversation
router.delete(
  "/:id",
  authenticateUser,
  deleteConversation
);

export default router;
