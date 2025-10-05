"use client";
import React, { useState } from "react";
import "../styling/Head.css";
import Link from "next/link";
import DropdownAlt from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import WalletPopup from "../Wallet/myWallet"

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
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
              <LanguageSwitcher />
            </li>
            <DropdownAlt />

            {!isLoggedIn ? (
              <button className="login-btn-1">
                <Link href="/authentication/login">Login</Link>
              </button>
            ) : (
              <>
                
                  
                  {/* <Link href="/wallet">Wallet</Link> */}
                
                <button className="login-btn">
                  <Link href="/dsr">DSR</Link>
                </button>
                <button className="login-btn">
                  <Link href="/bookingPage">Bookings</Link>
                </button>
                <button
                  className="login-btn"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </button>
                <WalletPopup/>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Actions */}
        <div className="mobile-actions">
          <LanguageSwitcher />
          <DropdownAlt />
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

      {/* Mobile Nav */}
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

          {!isLoggedIn ? (
            <Link href="/authentication/login">
              <button className="login-btn-1">Login</button>
            </Link>
          ) : (
            <>
              <WalletPopup/>
              <button className="login-btn-1">
                <Link href="/dsr">DSR</Link>
              </button>
              <button className="login-btn-1">
                <Link href="/books">Bookings</Link>
              </button>
              <button
                className="login-btn-1"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
