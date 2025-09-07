"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import emailjs from "emailjs-com";
import "../contact-us/contact.css"; // styles

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: "+973 Bahrain",
    mobile: "",
    email: "",
    contactFor: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // NEW

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true); // start loading

    emailjs
      .send(
        "service_wnvcqb7", // Service ID
        "template_2glvvph", // Template ID
        {
          title: formData.contactFor,
          name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          message: formData.message,
        },
        "kDbLa3cKzHZoklBLc" // Public Key
      )
      .then(
        () => {
          setStatus("✅ Message sent successfully!");
          setLoading(false);
        },
        () => {
          setStatus("❌ Failed to send. Try again later.");
          setLoading(false);
        }
      );
  };

  return (
    <>
      <Header />
      <div style={{ padding: "10px" }}>
        <div className="contact-container">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="form-group">
                <label>Country Code</label>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="+973 Bahrain">+973 Bahrain</option>
                  <option value="+92 Pakistan">+92 Pakistan</option>
                  <option value="+91 India">+91 India</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact for</label>
              <select
                name="contactFor"
                value={formData.contactFor}
                onChange={handleChange}
                required
              >
                <option value="">Nothing selected</option>
                <option value="Support">Support</option>
                <option value="Sales">Sales</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button className="sent-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                "Send"
              )}
            </button>
          </form>
          {status && <p className="status">{status}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
