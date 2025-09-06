"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ResultsContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [nights, setNights] = useState();

  // ✅ Filters state
  const [filters, setFilters] = useState({
    title: "",
    rating: "",
    priceRange: [0, 500], // default price range
  });

  useEffect(() => {
    setTimeout(() => {
      const dest = searchParams.get("destination") || "";
      const f = searchParams.get("from") || "";
      const t = searchParams.get("to") || "";
      const n = searchParams.get("nights") || "";
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
      setNights(n);
      setRooms(r);
      setResults(hotelsData[dest] || []);
      setLoading(false);
    }, 300);
  }, [searchParams]);

  // ✅ Filtering logic
  const filteredResults = useMemo(() => {
    return results.filter((hotel) => {
      // Title search
      if (
        filters.title &&
        !hotel.name.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      // Rating filter
      if (filters.rating) {
        const rating = parseFloat(hotel.rating);
        if (filters.rating === "4+" && rating < 4) return false;
        if (filters.rating === "3+" && rating < 3) return false;
        if (filters.rating === "2+" && rating < 2) return false;
        if (filters.rating === "1+" && rating < 1) return false;
      }

      // Price filter
      const [minPrice, maxPrice] = filters.priceRange;
      if (hotel.price < minPrice || hotel.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [results, filters]);

  // ✅ Clear filters
  const clearFilters = () => {
    setFilters({
      title: "",
      rating: "",
      priceRange: [0, 500],
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Please Wait...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HotelSearchBar
        initialDestination={destination}
        initialCheckIn={from}
        initialCheckOut={to}
        initialRooms={rooms}
      />
      <div className="results-container">
        {/* --- Filters Sidebar --- */}
        <aside className="filters">
          <h3>Filters</h3>
          <button className="clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>

          {/* Title Search */}
          <div className="filter-group">
            <label htmlFor="hotelName">Hotel Name</label>
            <input
              style={{
                border: "1px solid silver",
                fontSize: "13px",
                padding: "6px",
                borderRadius: "4px",
              }}
              id="hotelName"
              type="text"
              placeholder="Search by name..."
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <p>Guest Rating</p>
            {["4+", "3+", "2+", "1+"].map((rate) => (
              <label key={rate}>
                <input
                  type="radio"
                  name="rating"
                  value={rate}
                  checked={filters.rating === rate}
                  onChange={(e) =>
                    setFilters({ ...filters, rating: e.target.value })
                  }
                />
                {rate}
              </label>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <p>Price Range ($)</p>
            <Slider
              range
              min={0}
              max={1000}
              defaultValue={filters.priceRange}
              value={filters.priceRange}
              onChange={(value) =>
                setFilters({ ...filters, priceRange: value })
              }
            />
            <p>
              ${filters.priceRange[0]} – ${filters.priceRange[1]}
            </p>
          </div>
        </aside>

        {/* --- Hotel Results --- */}
        <main className="hotel-results">
          <div className="result-txt">
            <h2>
              {filteredResults.length > 0
                ? `Hotels in ${destination}`
                : `No hotels found in ${destination}`}
            </h2>
            <p>
              Check-in: <strong>{from?.slice(0, 10) || "N/A"}</strong> | Check-out:{" "}
              <strong>{to?.slice(0, 10) || "N/A"}</strong>
            </p>
            <p>
              Rooms: <strong>{rooms.length}</strong>
            </p>
          </div>

          <div className="hotel-list">
            {filteredResults.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <img src={hotel.image} alt={hotel.name} className="hotel-img" />
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p>Rating: {hotel.rating}</p>
                  {/* <p>rooms: {rooms.length}</p> */}
                  {/* <p>nights: {nights}</p> */}
                  <p className="price">${hotel.price} / night</p>
                  <Link
                    href={{
                      // pathname: "/booking",
                      pathname:"/hotel-view",
                      query: {
                        id: hotel.id,
                        name: hotel.name,
                        location: hotel.location,
                        price: hotel.price,
                        image: hotel.image,
                        from: from,
                        to: to,
                        rooms: JSON.stringify(rooms),
                        count: rooms.length,
                        nights: nights
                      },
                    }}
                  >
                    <button className="book-btn">Book Now</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
