import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🚫 Prevent logged-in users from accessing register page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message on every submit

    const res = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if (data.userId) {
      localStorage.setItem("userId", data.userId);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } else {
      setError(data.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="input-field"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input-field"
        />
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="switch-link">
        Already registered? <Link to="/login" className="login-link">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
