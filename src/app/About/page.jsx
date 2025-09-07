import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../About/about.css";

export default function About() {
  return (
    <div>
      <Header />
      <div className="main-cont">
        <h3
          className="abt-txt"
          style={{
            padding: "0px 0px 10px 0px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          About Us
        </h3>
        <p style={{ fontSize: "16px", color: " rgb(18, 18, 18)" }}>
          CityIn Booking platform is your smart gateway for local and
          international hotel reservations. The platform comes to bring peace of
          mind and travel closer to everyone, and makes reaching your next
          destination easy and fast. With options that suit different tastes and
          budgets, with the spirit of modern hospitality, to give you a unique
          and distinctive travel experience with a unique slogan “The far is
          closer” Individual consultations are available via WhatsApp with a
          call center that operates 24 hours a day, 7 days a week to help
          customers find an easy and comfortable accommodation experience and
          plan air travel for work or family vacations with a secure payment
          service
        </p>
        <h3
          className="abt-txt"
          style={{
            padding: "10px 0px 10px 0px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Our Services
        </h3>
        <div
          className="lst-txt"
          style={{
            padding: "10px 0px",
            fontSize: "16px",
            color: "rgb(18, 18, 18)",
          }}
        >
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              Tailored Packages : Customized packages based on individual
              preferences.
            </li>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              Hotel Bookings: International Hotels at competitive prices.
            </li>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              Flight Reservations : Book your flights with wide options.
            </li>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              Travel Insurance : Secure your Itinerary with peace of mind.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
