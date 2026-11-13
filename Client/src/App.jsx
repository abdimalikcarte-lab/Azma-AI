
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/chat" replace />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/chat" replace />
            : <Register />
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/chat"
          element={<Chat />}
        />
      </Route>

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/chat" : "/login"}
            replace
          />
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/chat" : "/login"}
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
