
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      navigate("/chat", { replace: true });

    } catch (err) {
      setError(
        err.message || "Registration failed. Please try again."
      );
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
          <h2>Create your account</h2>
          <p>Join AZMA AI and start your conversations.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="fullName">Full name</label>

            <div className="auth-input-wrapper">
              <User size={18} />

              <input
                id="fullName"
                className="form-control"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                minLength={2}
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>

            <div className="auth-input-wrapper">
              <Lock size={18} />

              <input
                id="confirmPassword"
                className="form-control"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default Register;
