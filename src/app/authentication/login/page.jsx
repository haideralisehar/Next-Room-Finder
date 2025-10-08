"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./login.css";

const Login = () => {
  const router = useRouter(); // ✅ Initialize router
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    language: "English",
  });

  // 👉 Load login state from localStorage on mount
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("userEmail");
    if (storedLogin === "true" && storedUser) {
      setIsLoggedIn(true);
      setFormData((prev) => ({ ...prev, email: storedUser }));
       router.push("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      // 👉 Simulate successful login
      setIsLoggedIn(true);

      // ✅ Save login state in storage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);

      alert("Login Successful!");

      // ✅ Redirect to homepage after login
      router.push("/");
    }
  };

  // 👉 Handle Logout (optional helper)
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      
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
     
       
      

      <Footer />
    </>
  );
};

export default Login;
