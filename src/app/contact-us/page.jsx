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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    emailjs
      .send(
        "service_wnvcqb7", // Service ID
        "template_2glvvph", // Template ID
        {
          title: formData.contactFor, // for {{title}}
          name: formData.fullName, // for {{name}}
          fullName: formData.fullName, // for {{fullName}} in From Name
          email: formData.email, // for {{email}} in Reply To
          message: formData.message, // for {{message}}
        },
        "kDbLa3cKzHZoklBLc" // Public Key
      )
      .then(
        () => setStatus("✅ Message sent successfully!"),
        (err) => setStatus("❌ Failed to send. Try again later.")
      );
  };

  return (
    <>
    <Header/>
    
    <div style={{padding:"10px"}}>

    <div className="contact-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <p>{formData.fullName}</p>
        <div className="row">
          <div>
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
          <div>
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

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

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

        <label>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        {/* <ReCAPTCHA sitekey="YOUR_RECAPTCHA_SITE_KEY" onChange={handleCaptcha} /> */}

        <button type="submit">Send</button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
    
    </div>
    <Footer/>
    </>
  );
};

export default ContactUs;
