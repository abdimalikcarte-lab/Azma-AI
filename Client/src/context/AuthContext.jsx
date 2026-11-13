
import {
  createContext,
  useContext,
  useState
} from "react";

import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

// ======================================
// AUTHENTICATION PROVIDER
// ======================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("azma_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("azma_user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Save authentication data
  function saveAuth(data) {
    localStorage.setItem("azma_token", data.token);
    localStorage.setItem("azma_user", JSON.stringify(data.user));

    setUser(data.user);
  }

  // ======================================
  // REGISTER
  // ======================================

  async function register(userData) {
    setLoading(true);

    try {
      const data = await authAPI.register(userData);

      saveAuth(data);

      return data;
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // LOGIN
  // ======================================

  async function login(credentials) {
    setLoading(true);

    try {
      const data = await authAPI.login(credentials);

      saveAuth(data);

      return data;
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // LOGOUT
  // ======================================

  function logout() {
    localStorage.removeItem("azma_token");
    localStorage.removeItem("azma_user");

    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user && localStorage.getItem("azma_token")),
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ======================================
// AUTHENTICATION HOOK
// ======================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
