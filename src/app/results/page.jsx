"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch"; // ✅ import data + search bar
import "./ResultsPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination") || "";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const rooms = JSON.parse(searchParams.get("rooms") || "[]");

  // ✅ Filter hotels directly from hotelsData
  const results = hotelsData[destination] || [];

  return (
    <>
    <Header/>
    
    <div className="results-container">
      {/* ✅ Search Bar stays on top, values pre-filled */}
      <HotelSearchBar
        initialDestination={destination}
        initialCheckIn={from}
        initialCheckOut={to}
        initialRooms={rooms}
      />
      <br />

      <h2>
        {results.length > 0
          ? `Hotels in ${destination}`
          : `No hotels found in ${destination}`}
      </h2>

      {/* ✅ Search Summary */}
      <div className="search-summary">
        <p>
          Check-in: <strong>{from?.slice(0, 10) || "N/A"}</strong> | 
          Check-out: <strong>{to?.slice(0, 10) || "N/A"}</strong>
        </p>
        <p>Rooms: <strong>{rooms.length}</strong></p>
      </div>
      <br />

      {/* ✅ Hotel List (vertical cards) */}
      <div className="hotel-list">
        {results.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <img src={hotel.image} alt={hotel.name} className="hotel-img" />
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p>{hotel.location}</p>
              <p className="price">${hotel.price} / night</p>
              <button className="book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Footer/>
    </>
  );
}
