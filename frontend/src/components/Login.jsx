import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token || !data.userId) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      alert("Login successful!");

      const statusRes = await fetch("http://localhost:8000/api/user/status", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const statusData = await statusRes.json();
      const { passed,score, lastAttempt } = statusData;

      if (lastAttempt === null || new Date() - new Date(lastAttempt) >= 7 * 24 * 60 * 60 * 1000) {
        return navigate("/dashboard");
      }
      if (!passed || score===0) {
        alert("🚫 You were disqualified or need to revisit references.");
        return navigate("/reference");
      }

      if (passed) {
        alert("🎉 You have already passed the test.");
        return navigate("/home");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </form>
      <p className="register-link">
        Not registered?{" "}
        <span onClick={() => navigate("/register")}>Register here</span>
      </p>
    </div>
  );
};

export default Login;
