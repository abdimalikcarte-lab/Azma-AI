
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Send,
  Plus,
  LogOut,
  Menu,
  MessageSquare,
  Trash2
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import {
  chatAPI,
  conversationAPI
} from "../services/api.js";

function Chat() {
  const { user, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  // Load conversation history
  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setHistoryLoading(true);

    try {
      const data = await conversationAPI.getAll();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  // Create a new conversation
  function newConversation() {
    setConversationId(null);
    setMessages([]);
    setInput("");
    setError("");
    setSidebarOpen(false);
  }

  // Open existing conversation
  async function openConversation(id) {
    setError("");

    try {
      const data = await conversationAPI.getMessages(id);

      setConversationId(id);
      setMessages(data.messages || []);
      setSidebarOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete conversation
  async function deleteConversation(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      await conversationAPI.delete(id);

      setConversations((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (String(conversationId) === String(id)) {
        newConversation();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Send message
  async function handleSend(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setError("");
    setInput("");

    const temporaryMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: message
    };

    setMessages((previous) => [
      ...previous,
      temporaryMessage
    ]);

    setLoading(true);

    try {
      const data = await chatAPI.sendMessage(
        message,
        conversationId
      );

      setConversationId(data.conversationId);

      setMessages((previous) => [
        ...previous,
        data.message
      ]);

      await loadConversations();

    } catch (err) {
      setError(err.message);

      setMessages((previous) =>
        previous.filter(
          (item) => item.id !== temporaryMessage.id
        )
      );

      setInput(message);

    } finally {
      setLoading(false);
    }
  }

  // Logout
  function handleLogout() {
    logout();
  }

  return (
    <div className="chat-layout">

      {/* SIDEBAR */}
      <aside className={`chat-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-brand">
          <div className="brand-icon">
            <Bot size={25} />
          </div>

          <div>
            <h2>AZMA AI</h2>
            <span>AI Assistant</span>
          </div>
        </div>

        <button
          className="new-chat-btn"
          onClick={newConversation}
        >
          <Plus size={18} />
          New conversation
        </button>

        <div className="conversation-section">

          <h3>Recent conversations</h3>

          {historyLoading ? (
            <p className="sidebar-empty">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="sidebar-empty">
              No conversations yet.
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                className={`conversation-item ${
                  String(conversationId) === String(conversation.id)
                    ? "active"
                    : ""
                }`}
                key={conversation.id}
              >
                <button
                  className="conversation-open"
                  onClick={() => openConversation(conversation.id)}
                >
                  <MessageSquare size={16} />

                  <span>{conversation.title}</span>
                </button>

                <button
                  className="conversation-delete"
                  onClick={() => deleteConversation(conversation.id)}
                  aria-label="Delete conversation"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}

        </div>

        <div className="sidebar-user">

          <div className="user-avatar">
            <User size={20} />
          </div>

          <div className="user-details">
            <strong>{user?.full_name || "AZMA User"}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="chat-main">

        <header className="chat-header">

          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="chat-header-title">
            <div className="online-indicator"></div>

            <div>
              <h3>AZMA AI</h3>
              <span>Intelligent Assistant</span>
            </div>
          </div>

          <button
            className="header-new-chat"
            onClick={newConversation}
          >
            <Plus size={17} />
            <span>New chat</span>
          </button>

        </header>

        {/* MESSAGES */}
        <section className="messages-area">

          {messages.length === 0 ? (

            <div className="welcome-screen">

              <div className="welcome-icon">
                <Bot size={42} />
              </div>

              <h1>Welcome to AZMA AI</h1>

              <p>
                Your intelligent assistant for learning,
                problem solving and productivity.
              </p>

              <div className="suggestion-grid">

                <button
                  onClick={() =>
                    setInput("Explain artificial intelligence.")
                  }
                >
                  <strong>Learn something</strong>
                  <span>Explain a complex topic simply</span>
                </button>

                <button
                  onClick={() =>
                    setInput("Help me write a professional email.")
                  }
                >
                  <strong>Writing assistance</strong>
                  <span>Create clear professional content</span>
                </button>

                <button
                  onClick={() =>
                    setInput("Help me understand JavaScript.")
                  }
                >
                  <strong>Programming</strong>
                  <span>Learn and solve coding problems</span>
                </button>

                <button
                  onClick={() =>
                    setInput("Give me a productivity plan.")
                  }
                >
                  <strong>Productivity</strong>
                  <span>Organize your goals and tasks</span>
                </button>

              </div>

            </div>

          ) : (

            <div className="messages-list">

              {messages.map((message) => (
                <div
                  className={`message-row ${message.role}`}
                  key={message.id}
                >

                  <div className="message-avatar">
                    {message.role === "assistant" ? (
                      <Bot size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>

                  <div className="message-content">
                    <strong>
                      {message.role === "assistant"
                        ? "AZMA AI"
                        : "You"}
                    </strong>

                    <p>{message.content}</p>
                  </div>

                </div>
              ))}

              {loading && (
                <div className="message-row assistant">

                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>

                  <div className="message-content">
                    <strong>AZMA AI</strong>
                    <p className="typing-indicator">
                      AZMA AI is thinking...
                    </p>
                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </section>

        {/* ERROR */}
        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        {/* MESSAGE INPUT */}
        <footer className="chat-input-area">

          <form
            className="chat-input-form"
            onSubmit={handleSend}
          >

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Message AZMA AI..."
              rows={1}
              maxLength={12000}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  handleSend(event);
                }
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>

          </form>

          <p>
            AZMA AI can make mistakes. Verify important information.
          </p>

        </footer>

      </main>

    </div>
  );
}

export default Chat;
