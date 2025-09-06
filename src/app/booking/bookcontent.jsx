"use client";
import React, { useState } from "react";
import styles from "../booking/Booking.module.css";
import { FaStar, FaRegStar    } from "react-icons/fa"; // ⭐ Icons
import {IoLocationOutline, IoCalendarOutline  }  from "react-icons/io5"
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSearchParams } from "next/navigation";


export default function BookingPage() {
     const searchParams = useSearchParams();
    // Get data from query
  const hotel = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    location: searchParams.get("location"),
    price: searchParams.get("price"),
    image: searchParams.get("image"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    count: searchParams.get("count"),
    nights: searchParams.get("nights"),
    rooms: searchParams.get("rooms")
      ? JSON.parse(searchParams.get("rooms"))
      : [],
   
  };

  console.log("Hotel Data:", hotel);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+92 Pakistan",
    phone: "",
    email: "",
    guestType: "Myself",
    specialRequest: "",
    termsAccepted: false,
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // API call here
  };

  return (
    <>
    <Header/>
    
    <div className={styles.container}>
      {/* Left Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 style={{fontSize:"18px", fontWeight:"bold"}}>Guests Details & Payment</h2>
        

        <div className={styles.inputGroup}>
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Country Code *</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+92 Pakistan">+92 Pakistan</option>
              <option value="+91 India">+91 India</option>
              <option value="+1 USA">+1 USA</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Guests</h3>
        <div className={styles.toggle}>
          <button
            type="button"
            className={formData.guestType === "Myself" ? styles.active : ""}
            onClick={() => setFormData((p) => ({ ...p, guestType: "Myself" }))}
          >
            Myself
          </button>
          <button
            type="button"
            className={formData.guestType === "Someone else" ? styles.active : ""}
            onClick={() =>
              setFormData((p) => ({ ...p, guestType: "Someone else" }))
            }
          >
            Someone else
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label>Any Special Request?</label>
          <textarea
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            placeholder="Enter request..."
          />
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
          />
          <label>
            I Accept The <a href="#">Term And Conditions</a>
          </label>
        </div>

        <div className={styles.payment}>
          <p>Payment Method</p>
          <div className={styles.methods}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              <span style={{marginRight:"8px"}}></span>Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="apple"
                checked={formData.paymentMethod === "apple"}
                onChange={handleChange}
              />
              <span style={{marginRight:"8px"}}></span>Apple Pay
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="gpay"
                checked={formData.paymentMethod === "gpay"}
                onChange={handleChange}
              />
              <span style={{marginRight:"8px"}}></span>Google Pay
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Proceed To Pay
        </button>
      </form>

      {/* Right Summary */}
<div className={styles.summary}>
  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Booking Summary</h2>
  <div className={styles.hotelCard}>
    <img
      src={hotel.image}
      alt="Hotel"
      className={styles.hotelImg}
    />
    <div>
      {/* ⭐ Rating Row */}
      <div className={styles.rating}>
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaRegStar className={styles.star} />
      </div>

      <h4>{hotel.name}</h4>
      <div className="loc-ico" style={{display:"flex", gap:"5px"}}>
        <IoLocationOutline   />
        <p style={{marginTop:"-2px"}}>{hotel.location}</p>
      </div>
      
      {/* <p>Check-in: Sep 7, 2025</p>
      <p>Check-out: Sep 8, 2025</p>
      <p>Room 1 | 2 Adults</p>
      <p>Double or Twin Room</p>
      <p>BHD 33.550 per night</p> */}
    </div>
  </div>
  <div className={styles.totalBoxs}>
    <div className="check-ico" style={{display:"flex", gap:"5px"}}>
        <IoCalendarOutline />
        <p style={{marginTop:"-2px"}}>Check-in & Check-out</p>
    </div>

    <p style={{padding:"7px 0px 5px 1px", color:"#1e1e1eff"}}>{hotel.from ? hotel.from.slice(0, 10): "N/A"} - {hotel.to ? hotel.to.slice(0, 10): "N/A"} ({hotel.nights > 1 ? `${hotel.nights} Nights` : `${hotel.nights} Night`})
</p>
    
    
  </div>

  <div className={styles.totalBoxe}>
    <div className={styles.totalBox} >
      <h5>Total Cal.</h5>
    <p>USD {hotel.price} / night x {hotel.count} room(s) x {hotel.nights} Night(s)</p>
    </div>
    <div className={styles.totalBoxee}>
      Total
      <h4> USD {hotel.price*hotel.count*hotel.nights}</h4>
    </div>
    
    
    
    
  </div>

  <div className={styles.policy}>
    <h4>Cancellation Policy</h4>
    <p>Non-Refundable</p>
  </div>

  <div className={styles.policy}>
    <h4>Important Information</h4>
    <p>No extra info shared by Hotel.</p>
  </div>
</div>

    </div>
    <Footer/>
    </>
  );
}
