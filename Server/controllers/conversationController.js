
import { query } from "../config/db.js";

// ======================================
// GET ALL USER CONVERSATIONS
// ======================================

export async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT
        c.id,
        c.title,
        c.is_archived,
        c.created_at,
        c.updated_at,
        (
          SELECT content
          FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at DESC, id DESC
          LIMIT 1
        ) AS last_message
       FROM conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      conversations: result.rows
    });

  } catch (error) {
    next(error);
  }
}

// ======================================
// GET CONVERSATION MESSAGES
// ======================================

export async function getConversationMessages(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await query(
      `SELECT id, title
       FROM conversations
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

    const result = await query(
      `SELECT id, role, content, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC, id ASC`,
      [id]
    );

    return res.status(200).json({
      success: true,
      conversation: conversation.rows[0],
      messages: result.rows
    });

  } catch (error) {
    next(error);
  }
}

// ======================================
// DELETE CONVERSATION
// ======================================

export async function deleteConversation(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
      `DELETE FROM conversations
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully."
    });

  } catch (error) {
    next(error);
  }
}
