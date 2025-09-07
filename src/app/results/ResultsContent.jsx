"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css";
import Link from "next/link";
import Filters from "../components/filter"; // ✅ Import Filters component
import { IoLocationOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

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
    priceRange: [0, 500],
  });

  // ✅ Sorting state
  const [sortOption, setSortOption] = useState("");

  // ✅ Popup state for filters
  const [showFilterPopup, setShowFilterPopup] = useState(false);

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

  // ✅ Filtering + Sorting logic
  const filteredResults = useMemo(() => {
    let data = results.filter((hotel) => {
      if (
        filters.title &&
        !hotel.name.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      if (filters.rating) {
        const rating = parseFloat(hotel.rating);
        if (filters.rating === "4+" && rating < 4) return false;
        if (filters.rating === "3+" && rating < 3) return false;
        if (filters.rating === "2+" && rating < 2) return false;
        if (filters.rating === "1+" && rating < 1) return false;
      }
      const [minPrice, maxPrice] = filters.priceRange;
      if (hotel.price < minPrice || hotel.price > maxPrice) {
        return false;
      }
      return true;
    });

    if (sortOption) {
      data = [...data].sort((a, b) => {
        switch (sortOption) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating-low":
            return parseFloat(a.rating) - parseFloat(b.rating);
          case "rating-high":
            return parseFloat(b.rating) - parseFloat(a.rating);
          case "stars-low":
            return a.stars - b.stars;
          case "stars-high":
            return b.stars - a.stars;
          default:
            return 0;
        }
      });
    }
    return data;
  }, [results, filters, sortOption]);

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

      {/* --- Top bar with results count + sort --- */}
      <div className="nf-pro">
        <p>
          {/* {filteredResults.length} properties in {destination} */}
        </p>
<div style={{display:"flex", gap:"6px"}}>
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating-low">Rating: Low to High</option>
          <option value="rating-high">Rating: High to Low</option>
          <option value="stars-low">Stars: Low to High</option>
          <option value="stars-high">Stars: High to Low</option>
        </select>

        {/* ✅ Filter Button to open popup */}
        <button
          className="search-btns"
          onClick={() => setShowFilterPopup(true)}
        >
          Filter
        </button>
        </div>
      </div>

      <div className="results-container">
         <Filters
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />
        {/* --- Hotel Results --- */}
        <main className="hotel-results">
          <div className="hotel-list">
            {filteredResults.map((hotel) => (
              <Link
                key={hotel.id}
                href={{
                  pathname: "/hotel-view",
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
                    nights: nights,
                  },
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="hotel-card">
                  <div className="hotel-img-wrapper">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="hotel-img"
                    />
                    <div className="favorite-icon">❤</div>
                  </div>

                  <div className="hotel-details">
                    <div className="hotel-header">
                      <div className="stars">⭐⭐⭐⭐⭐</div>
                      <h3>{hotel.name}</h3>
                    </div>

                    <div className="m-xtx-set" style={{ display: "flex" }}>
                      <IoLocationOutline />
                      <p className="location">{hotel.location}</p>
                    </div>

                    <p className="breakfast">🥗 Breakfast included</p>

                    <div className="hotel-footer">
                      <div className="rating">
                        <span className="rating-badge">{hotel.rating}</span>
                        <span>{hotel.rating >= 8 ? "Very Good" : "Good"}</span>
                      </div>

                      <div className="price-info">
                        <p className="price">{hotel.price} USD</p>
                        <p className="price-sub">
                          1 room(s) <br /> {nights} night(s) incl. taxes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* ✅ Filter Popup */}
      {showFilterPopup && (
        <div className="popup-overlay">
          <div className="popup filter-popup">
            <button
              className="close-btn"
              onClick={() => setShowFilterPopup(false)}
            >
              <FaTimes /> Close
            </button>
            <h2>Filter Hotels</h2>
            <Filters
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
