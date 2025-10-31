"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./login.css";
import Lottie from "lottie-react";
import ErrorSvg from "../../../lotti-img/error.json";
import SuccessSvg from "../../../lotti-img/upload.json"; 

const Login = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [isShowSuccess, setIsShowSuccess] = useState(false); // ✅ new success state

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    remember: false,
    language: "English",
  });

  // ✅ Check if token already exists — redirect if logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
      router.push("/");
    }
  }, [router]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }

      // ✅ Successful login popup
      setIsShowSuccess(true);

      // Automatically close popup after 5 seconds and redirect
      setTimeout(() => {
        setIsShowSuccess(false);
        router.push("/"); 
      }, 5000);

    } catch (err) {
      setIsLoggingIn(false);
      setIsShowError(true);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("token");
    Cookies.remove("userId");
  };

  return (
    <>
      {/* Loading Spinner */}
      {isLoggingIn && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      {/* ❌ Error Popup */}
      {isShowError && (
        <div className="loading-overlay">
          <div className="loading-box-1">
            <Lottie className="loty" animationData={ErrorSvg} />
            <h4 style={{ fontWeight: "600" }}>Error Raised</h4>
            {error && <p className="error-text">{error}</p>}
            <button
              className="cls-err-btn"
              onClick={() => setIsShowError(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Success Popup */}
      {isShowSuccess && (
        <div className="loading-overlay">
          <div className="loading-box-1">
            <Lottie className="loty-1" animationData={SuccessSvg} />
            {/* <h4 style={{ fontWeight: "600" }}>Access Granted Successfully! </h4> */}
          </div>
        </div>
      )}

      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="login-container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2 className="login-title">Please login</h2>

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

          <label className="login-label">Username</label>
          <input
            type="text"
            name="userName"
            placeholder="Enter your username"
            value={formData.userName}
            onChange={handleChange}
            className="login-input"
            required
          />

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

          <div className="remember-section">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </div>

          <button type="submit" className="login-btns" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

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
