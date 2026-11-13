
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/chat", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-brand">
          <div className="brand-icon">
            <Bot size={30} />
          </div>

          <h1>AZMA AI</h1>

          <p>Your intelligent AI assistant</p>
        </div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue your conversations.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <div className="auth-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="auth-input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                className="form-control"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create account</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default Login;
