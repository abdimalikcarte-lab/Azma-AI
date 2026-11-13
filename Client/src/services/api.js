
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ======================================
// API REQUEST HANDLER
// ======================================

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("azma_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json().catch(() => ({
    success: false,
    message: "Invalid server response."
  }));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ======================================
// AUTHENTICATION API
// ======================================

export const authAPI = {
  register(userData) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  },

  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  }
};

// ======================================
// CHAT API
// ======================================

export const chatAPI = {
  sendMessage(message, conversationId = null) {
    return request("/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversationId
      })
    });
  }
};

// ======================================
// CONVERSATION API
// ======================================

export const conversationAPI = {
  getAll() {
    return request("/conversations");
  },

  getMessages(conversationId) {
    return request(`/conversations/${conversationId}/messages`);
  },

  delete(conversationId) {
    return request(`/conversations/${conversationId}`, {
      method: "DELETE"
    });
  }
};

// ======================================
// GENERAL API
// ======================================

export const healthAPI = {
  check() {
    return request("/health");
  }
};

export default request;
