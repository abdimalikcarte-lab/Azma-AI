import OpenAI from "openai";
import { query } from "../config/db.js";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AZMA AI instructions
const SYSTEM_PROMPT = `
You are AZMA AI, an intelligent and helpful AI assistant.

Your responsibilities:
- Answer questions clearly and accurately.
- Support both Somali and English.
- Use the same language as the user whenever possible.
- Explain technical topics step by step.
- Be professional, respectful and helpful.
- If you do not know an answer, say so honestly.
- Never invent facts or pretend to have performed actions.
`;

// ======================================
// SEND CHAT MESSAGE
// ======================================

export async function sendChatMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const { message, conversationId } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required."
      });
    }

    if (message.length > 12000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 12,000 characters."
      });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI service is not configured yet."
      });
    }

    let activeConversation;

    // Find existing conversation
    if (conversationId) {
      const result = await query(
        `SELECT id
         FROM conversations
         WHERE id = $1 AND user_id = $2`,
        [conversationId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found."
        });
      }

      activeConversation = result.rows[0];

    } else {
      // Create new conversation
      const title = message.trim().slice(0, 60);

      const result = await query(
        `INSERT INTO conversations (user_id, title)
         VALUES ($1, $2)
         RETURNING id, title`,
        [userId, title]
      );

      activeConversation = result.rows[0];
    }

    // Save user message
    await query(
      `INSERT INTO messages (conversation_id, role, content)
       VALUES ($1, 'user', $2)`,
      [activeConversation.id, message.trim()]
    );

    // Retrieve recent conversation history
    const historyResult = await query(
      `SELECT role, content
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC, id DESC
       LIMIT 20`,
      [activeConversation.id]
    );

    // Reverse history to chronological order
    const history = historyResult.rows.reverse();

    // Prepare AI messages
    const aiMessages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...history.map((item) => ({
        role: item.role,
        content: item.content
      }))
    ];

    // Request AI response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1500
    });

    const aiResponse =
      completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(502).json({
        success: false,
        message: "AI could not generate a response."
      });
    }

    // Save AI response
    const savedResponse = await query(
      `INSERT INTO messages (conversation_id, role, content)
       VALUES ($1, 'assistant', $2)
       RETURNING id, role, content, created_at`,
      [activeConversation.id, aiResponse]
    );

    // Update conversation timestamp
    await query(
      `UPDATE conversations
       SET updated_at = NOW()
       WHERE id = $1`,
      [activeConversation.id]
    );

    return res.status(200).json({
      success: true,
      conversationId: activeConversation.id,
      reply: savedResponse.rows[0].content,
      message: savedResponse.rows[0]
    });

  } catch (error) {
    next(error);
  }
}
