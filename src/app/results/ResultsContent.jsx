"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar, { hotelsData } from "../components/RoomSearch";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css";
import Link from "next/link";
import Filters from "../components/filter"; // ✅ Import Filters component

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

    // ✅ Apply Sorting
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
          
            {filteredResults.length} properties in {destination}
            {/* {filteredResults.length} destinations */}
         
        </p>

        {/* ✅ Sort Dropdown (aligned right) */}
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
      </div>

      <div className="results-container">
        {/* --- Filters Sidebar --- */}
        <Filters
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />

        {/* --- Hotel Results --- */}
        <main className="hotel-results">
          <div className="hotel-list">
            {filteredResults.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <img src={hotel.image} alt={hotel.name} className="hotel-img" />
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p>Rating: {hotel.rating}</p>
                  <p>Stars: {hotel.stars}</p> {/* ✅ Show stars */}
                  <p>
                    Rooms: <strong>{rooms.length}</strong>
                  </p>
                  <p className="price">${hotel.price} / night</p>
                  <Link
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
