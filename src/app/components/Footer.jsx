import React from "react";
import Link from "next/link";
import "../styling/Footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <div className="logo">
            <img
              src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png"
              alt="City In Booking"
              className="logo-img"
            />
            {/* <span className="logo-text">City In Booking</span> */}
          </div>
          <div className="social-icons">
            <a href="#" className="social-btn instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-btn whatsapp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <h3>Links</h3>
          <div className="line"></div>
          <ul>
            <li>
              <Link href="/About">About Us</Link>
            </li>
            <li>
              <Link href="/terms-conditions">Terms And Conditions</Link>
             
            </li>
            <li>
              <Link href="/privacy-policy">Privacy And Policy</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        {/* <div className="footer-help">
          <h4>Looking for help?</h4>
          <p className="sub-title">Our team is available 24/7</p>
          <p className="whatsapp-1">
            <FaWhatsapp /> +973 7791 8877
          </p>
          <p>
            <FaWhatsapp /> +966 5540 88227
          </p>
          <p>
            <MdEmail /> support@cityin.net
          </p>
        </div> */}

        <div className="contact-support">
      <h3>Looking for help?</h3>
      <p className="subtitle">Our team is available 24/7</p>

      <div className="support-item">
        <FaWhatsapp className="icon" />
        <div>
          <p>Get support via WhatsApp:</p>
          <p className="number">+973 7791 8877</p>
        </div>
      </div>

      <div className="support-item">
        <FaWhatsapp className="icon" />
        <div>
          <p>Get support via WhatsApp:</p>
          <p className="number">+966 5540 88227</p>
        </div>
      </div>

      <div className="support-item">
        <MdEmail className="icon" />
        <div>
          <p>Or you can email us at:</p>
          <p className="email">support@cityin.net</p>
        </div>
      </div>
    </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>
          © 2025 CityIn Booking 
          {/* | Developed by <span>Haider Ali Sehar</span> */}
        </p>
        <div className="payment-icons">
          <img
            src="https://img.icons8.com/color/48/mastercard-logo.png"
            alt="Mastercard"
          />
          <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
          <img
            src="https://img.icons8.com/color/48/google-pay.png"
            alt="Google Pay"
          />
          <img
            src="https://img.icons8.com/color/48/apple-pay.png"
            alt="Apple Pay"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
