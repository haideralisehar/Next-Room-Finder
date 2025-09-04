"use client"
import React, { useState } from "react";
import "../styling/Head.css";
import Link from "next/link";
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
            <li><Link href="/About">About Us</Link></li>
            <li><a href="/ar">العربية</a></li>
            <li className="dropdown">
              <button className="dropbtn">USD ▾</button>
              <div className="dropdown-content">
                <a href="/">USD</a>
                <a href="/">EUR</a>
                <a href="/">PKR</a>
              </div>
            </li>
           <button  className="login-btn-1"><Link href="/authentication/login">Login</Link></button>
          </ul>
        </nav>

        {/* Hamburger (mobile only) */}

        <div className="mobile-actions">
    <a href="/ar" className="mobile-lang">العربية</a>
    <div className="dropdown mobile-currency">
      <button className="dropbtn">USD ▾</button>
      <div className="dropdown-content">
        <a href="/">USD</a>
        <a href="/">EUR</a>
        <a href="/">PKR</a>
      </div>
    </div>
    
        
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-controls="mobileMenu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
        </div>
         </div>
         
        
     

      {/* Mobile Nav (always mounted) */}
      <nav
        id="mobileMenu"
        className={`nav mobile-nav ${menuOpen ? "open" : ""}`}
      >
        
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/search">Search</a></li>
          <li><Link href="/About">About Us</Link></li>
          
          
          <button  className="login-btn-1"><Link href="/authentication/login">Login</Link></button>
        </ul>
      </nav>
    </header>
  );
};

export default Header;