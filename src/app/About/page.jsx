import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div>
      <Header />
      <div className="main-cont" style={{ padding: "40px 40px 10px 40px" }}>
        <h3
          className="abt-txt"
          style={{ padding: "0px 0px 10px 0px", fontSize: "20px" }}
        >
          About Us
        </h3>
        <p style={{ fontSize: "14px", color: "#4e4e4eff" }}>
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
          style={{ padding: "10px 0px 10px 0px", fontSize: "20px" }}
        >
          Our Services
        </h3>
        <div className="lst-txt" style={{ padding: "10px 0px 10px 0px", fontSize: "14px", color: "#4e4e4eff", overflow:"hidden" }}>
        <li>
          Tailored Packages : Customized packages based on individual
          preferences.
        </li>
        <li>Hotel Bookings: International Hotels at competitive prices.</li>
        <li>Flight Reservations : Book your flights with wide options.</li>
        <li>Travel Insurance : Secure your Itinerary with peace of mind.</li>
      </div>
      </div>

      <Footer />
    </div>
  );
}
