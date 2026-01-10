"use client";
import React, { useState, useEffect, useRef } from "react";
import "../styling/Head.css";
import Link from "next/link";
import DropdownAlt from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import WalletPopup from "../Wallet/myWallet";
import Image from "next/image";
import { FaChartBar, FaUserCircle, FaSuitcaseRolling, FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react"
import ErrorSvg from "../../lotti-img/error.json";



const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // ✅ Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  const token = Cookies.get("token");
      const userId = Cookies.get("userId");

  // ✅ Load login status
  useEffect(() => {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
      if (token && userId) {
        setIsLoggedIn(true);
        router.push("/");
      }
    }, [router]);

    async function handleLogout() {
    setIsLoggingOut(true); // Show loader
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          window.location.href = "/authentication/login";
        }, 1500); // small delay for visual smoothness
      } else {
        alert("Logout failed, please try again.");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const togglePopup = () => setShowPopup((prev) => !prev);

  

  return (

    <>
    {isLoggingOut && (
                         <div className="loading-container">
                    <div className="box">
                      <Image
                        className="circular-left-right"
                        src="/loading_ico.png"
                        alt="Loading"
                        width={200}
                        height={200}
                      />
                      <p style={{ fontSize: "13px" }}>Signing Out...</p>
                    </div>
                  </div>
                  
                        )}
    
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
            <li><Link href="/results">Search</Link></li>
            {!isLoggedIn ? (
              <li><Link href="/About">About Us</Link></li>

            ):""}
            
            
            <li><LanguageSwitcher /></li>
            {/* <DropdownAlt /> */}

            {!token && !userId ? (
              <>
              <button className="login-btn-1">
                <Link href="/authentication/login">Login</Link>
              </button>

              <button>
                 <Link href="/authentication/Register" className="login-btn-1">Register </Link>
              </button>
              </>
            ) : (
              <>
              
                <WalletPopup />

                {/* 🔹 Menu Image + Popup */}
                <div className="menu-container" ref={popupRef}>
                  <Image
                    src="/menu.png"
                    alt="Menu"
                    width={25}
                    height={25}
                    style={{ cursor: "pointer" }}
                    onClick={togglePopup}
                  />

                  {showPopup && (
                    <div className="menu-popup">
                      <div className="popup-arrow"></div>
                      <Link href="/profile" className="menu-item"><FaUserCircle className="menu-icon" />My Account</Link>
                      <Link href="/dsr" className="menu-item"><FaChartBar className="menu-icon" /> DSR</Link>
                      <Link href="/bookingPage" className="menu-item"><FaSuitcaseRolling className="menu-icon" />My Bookings</Link>
                      <div className="menu-item logout" onClick={handleLogout}>
                        <FaSignOutAlt className="menu-icon" />Logout
                      </div>
                    </div>
                  )}
                </div>
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
      <nav id="mobileMenu" className={`nav mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><Link href="/results">Search</Link></li>
          <li><Link href="/About">About Us</Link></li>

          {!token && !userId ? (
            <Link href="/authentication/login">
              <button className="login-btn-1">Login</button>
            </Link>
          ) : (
            <>
              {/* <WalletPopup /> */}

               <Link href="/profile" className="login-btn-1">
               <button>
               My Account
               </button>
               </Link>

              <Link className="login-btn-1" href="/mobilewallet">
              <button >Wallet</button></Link>
              <button className="login-btn-1"><Link href="/dsr">DSR</Link></button>
              <button className="login-btn-1"><Link href="/bookingPage">Bookings</Link></button>
              <button className="login-btn-1" onClick={handleLogout}>Logout</button>
            </>
          )}
        </ul>
      </nav>
    </header>

    </>
  );
};

export default Header;
