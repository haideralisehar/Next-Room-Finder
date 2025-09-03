"use client";
import React, { useState } from "react";
import "../styling/Head.css";
import { BsDisplay } from "react-icons/bs";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img
            src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png"
            alt="City In Booking"
            className="logo-img"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/search">Search</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/ar">العربية</a></li>
            <li className="dropdown">
              <button className="dropbtn">USD ▾</button>
              <div className="dropdown-content">
                <a href="/">USD</a>
                <a href="/">EUR</a>
                <a href="/">PKR</a>
              </div>
            </li>
            <li><button className="login-btn">Login</button></li>
          </ul>
        </nav>

        {/* Hamburger (mobile only) */}
        
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-controls="mobileMenu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
         </div>
         
        
     

      {/* Mobile Nav (always mounted) */}
      <nav
        id="mobileMenu"
        className={`nav mobile-nav ${menuOpen ? "open" : ""}`}
      >
        
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/about">About Us</a></li>
          
          
          <li><button className="login-btn">Login</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
