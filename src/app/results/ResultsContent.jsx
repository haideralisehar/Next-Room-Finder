"use client";

import { Suspense } from 'react'
import React from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch";
import "./ResultsPage.css";

export default function ResultsContent() {
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  let rooms = [];
  try {
    rooms = searchParams.get("rooms")
      ? JSON.parse(decodeURIComponent(searchParams.get("rooms")))
      : [];
  } catch (e) {
    console.error("Invalid rooms data:", e);
  }

  const results = hotelsData[destination] || [];

  return (
    <Suspense>
    <div className="results-container">
      <HotelSearchBar
        initialDestination={destination}
        initialCheckIn={from}
        initialCheckOut={to}
        initialRooms={rooms}
      />

      <h2>
        {results.length > 0
          ? `Hotels in ${destination}`
          : `No hotels found in ${destination}`}
      </h2>

      <div className="search-summary">
        <p>
          Check-in: <strong>{from?.slice(0, 10) || "N/A"}</strong> | 
          Check-out: <strong>{to?.slice(0, 10) || "N/A"}</strong>
        </p>
        <p>Rooms: <strong>{rooms.length}</strong></p>
      </div>

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
    </Suspense>
  );
}
