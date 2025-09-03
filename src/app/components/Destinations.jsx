import React from "react";
import "../styling/Destinations.css";
import Link from "next/link";

const Destinations = () => {
  return (
    <div className="desti-main">
        <p className="destination-heading">Top Destinations</p>
        <h3 className="abt-heading">About Us</h3>
        <p className="para-txt">
            CityIn platform is your smart gateway for local and international hotel reservations. The platform comes to bring peace of mind and travel closer to everyone, and makes reaching your next destination easy and fast. With options that suit different tastes and budgets, with the spirit of modern hospitality, to give you a unique and distinctive travel experience with a unique slogan
        </p>
        <br />
        <p className="para-txt">
            “The far is closer”
        </p>
        <br />
        <p className="para-txt">
           Individual consultations are available via WhatsApp with a call center that operates 24 hours a day, 7 days a week to help customers find an easy and comfortable accommodation experience and plan air travel for work or family vacations with a secure payment service
        </p>

        <Link href="/About"><button className="abt-more-btn">Read More</button></Link>

    
    </div>
  );
};

export default Destinations;
