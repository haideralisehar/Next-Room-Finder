"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css"

export default function ResultsContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Simulate fetching or parsing delay
    setTimeout(() => {
      const dest = searchParams.get("destination") || "";
      const f = searchParams.get("from") || "";
      const t = searchParams.get("to") || "";
      let r = [];
      try {
        r = searchParams.get("rooms")
          ? JSON.parse(decodeURIComponent(searchParams.get("rooms")))
          : [];
      } catch (e) {
        console.error("Invalid rooms data:", e);
      }

      setDestination(dest);
      setFrom(f);
      setTo(t);
      setRooms(r);
      setResults(hotelsData[dest] || []);
      setLoading(false);
    }, 300); // simulate small delay
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
      <div className="spinner"></div>
      <p>Please Wait...</p>
    </div>
    <Footer/>
    </>
      
    );
  }

  return (
    <>
      <Header />
      <div className="results-container">
        <div className="fixed-search">
          <HotelSearchBar
            initialDestination={destination}
            initialCheckIn={from}
            initialCheckOut={to}
            initialRooms={rooms}
          />
        </div>
        <div className="result-txt" style={{ padding: "20px" }}>
          <h2 translate="yes">
            {results.length > 0 ? `Hotels in ${destination}` : `No hotels found in ${destination}`}
          </h2>
          <div className="search-summary">
            <p>
              Check-in: <strong>{from?.slice(0, 10) || "N/A"}</strong> | Check-out:{" "}
              <strong>{to?.slice(0, 10) || "N/A"}</strong>
            </p>
            <p>Rooms: <strong>{rooms.length}</strong></p>
          </div>
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
      <Footer />
    </>
  );
}
