"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./login.css"; // Import CSS file

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // track login

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    language: "English",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 yahan real login API call hogi
    if (formData.email && formData.password) {
      setIsLoggedIn(true);
      alert("Login Successful!");
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {!isLoggedIn ? (
        <div className="login-container">
          <form className="login-box" onSubmit={handleSubmit}>
            <h2 className="login-title">Please login</h2>

            {/* Language Selector */}
            <label className="login-label">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="login-input"
            >
              <option>English</option>
              <option>Arabic</option>
            </select>

            {/* Email */}
            <label className="login-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />

            {/* Password */}
            <label className="login-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />

            {/* Remember me */}
            <div className="remember-section">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btns">
              Login
            </button>

            {/* Forgot Password */}
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </form>
        </div>
      ) : (
        <div className="login-container">
          <h2>Welcome, {formData.email}!</h2>
          <p>You are logged in.</p>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Login;
