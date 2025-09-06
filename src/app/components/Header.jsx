"use client";
import React, { useState } from "react";
import "../styling/Head.css";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { BsDisplay } from "react-icons/bs";
import LanguageSwitcher from "./LanguageSwitcher";

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
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link href="/results">Search</Link>
            </li>
            <li>
              <Link href="/About">About Us</Link>
            </li>
            <li>
              <LanguageSwitcher/>
            </li>
            <Dropdown />
            <button className="login-btn-1">
              <Link href="/authentication/login">Login</Link>
            </button>
          </ul>
        </nav>

        {/* Hamburger (mobile only) */}

        <div className="mobile-actions">
          {/* <a href="/ar" className="mobile-lang">
            العربية
          </a> */}
          <LanguageSwitcher/>
          <Dropdown />

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
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <Link href="/results">Search</Link>
          </li>
          <li>
            <Link href="/About">About Us</Link>
          </li>

          <Link href="/authentication/login">
            <button className="login-btn-1">Login</button>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
