"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar from "../components/RoomSearch";
import { hotelsData } from "../HotelDetails/hoteldata.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css";
import Link from "next/link";
import Filters from "../components/filter"; // ✅ Import Filters component
import MobFilter from "../components/MobFilter";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import StarRating from "../components/rating";
import { useCurrency } from "../Context/CurrencyContext";
import MapWithPrices from "../MapView/MapShow"
export default function ResultsContent() {
  const searchParams = useSearchParams();

  const { currency, convertPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [nights, setNights] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [facilities, setFacility] = useState([]);
  const handlePopupToggle = () => setShowPopup(!showPopup);
  const [showMap, setShowMap] = useState(true); // map show

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
      const d = searchParams.get("description");

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
      setDescription(d);
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
        initialRooms={
          rooms.length > 0
            ? rooms
            : [{ adults: 2, children: 0, childrenAges: [] }]
        }
      />

      {/* --- Top bar with results count + sort --- */}
      <div className="nf-pro">
        <p>
          {filteredResults.length === 0
            ? "No Hotel Available"
            : `${filteredResults.length} properties in ${destination}`}
          {/* {filteredResults.length} destinations */}
          {/* {filteredResults.length} properties in {destination} */}
          {/* {filteredResults.length} destinations */}
        </p>
        <div
          className="set-fil"
          style={{ display: "flex", gap: "7px", marginTop: "10px" }}
        >
          <div
            className="btn-filter"
            style={{
              padding: "7px 12px 6px 12px",
              borderRadius: "5px",
              background: " #0071c2",
              color: "white",
              cursor: "pointer",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "center" }}
              onClick={handlePopupToggle}
            >
              <FaFilter />{" "}
              <p style={{ fontSize: "14px", fontWeight: "normal" }}>Filter</p>
            </div>
          </div>
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
      </div>

      <div className="results-container">
        {/* <div className="room-details">
      <p><strong>{rooms.length}</strong> room(s)</p>
      {rooms.map((room, index) => (
        <p key={index} style={{ fontSize: "13px", margin: "2px 0" }}>
          Room {index + 1}: {room.adults} adult(s), {room.children} child(ren)
        </p>
      ))}
    </div> */}

        {/* <div className="room-details">
      <p><strong>{rooms.length}</strong> room(s)</p>
      {rooms.map((room, index) => (
        <div key={index} style={{ fontSize: "13px", margin: "4px 0" }}>
          <p>
            Room {index + 1}: {room.adults} adult(s), {room.children} child(ren)
          </p>
          {room.children > 0 && (
            <p style={{ marginLeft: "10px", color: "gray" }}>
              Ages: {room.childrenAges && room.childrenAges.length > 0
                ? room.childrenAges.join(", ")
                : "Not specified"}
            </p>
          )}
        </div>
      ))}
    </div> */}
        {destination === "" ? (
          // --- Show message only ---
          <main className="hotel-results">
            <div className="hotel-list">
              <p
                style={{
                  fontSize: "16px",
                  color: "gray",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Try searching or find other hotels
              </p>
            </div>
          </main>
        ) : (
          // --- Show Filters + Results ---
          <>
            {/* Filters Sidebar */}
            <Filters
            setShowMap={setShowMap}
            showMap={showMap}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />

            {/* Hotel Results */}

            {showMap && (
            <main className="hotel-results">
              <div className="hotel-list">
                {filteredResults.length === 0 ? (
                  <p
                    style={{
                      fontSize: "16px",
                      color: "gray",
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No properties found for "{destination}". Try adjusting
                    filters or search for another place.
                  </p>
                ) : (
                  filteredResults.map((hotel) => (
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
                          rating: hotel.rating,
                          description: hotel.description,
                          facility: JSON.stringify(hotel.facilities),
                          roomImages: JSON.stringify(hotel.roomImages),
                          hotelRooms: JSON.stringify(hotel.rooms),
                          roomPhotos: JSON.stringify(hotel.roomImages),
                        },
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="hotel-card">
                        {/* Left: Image */}
                        <div className="hotel-img-wrapper">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="hotel-img"
                          />
                          <div className="favorite-icon">❤</div>
                        </div>

                        {/* Right: Details */}
                        <div className="hotel-details">
                          <div className="hotel-header">
                            <StarRating rating={hotel.rating} />
                            <h3>{hotel.name}</h3>
                          </div>

                          <div
                            className="m-xtx-set"
                            style={{ display: "flex" }}
                          >
                            <IoLocationOutline />
                            <p className="location">{hotel.location}</p>
                          </div>

                          <p className="breakfast">🥗 Breakfast included</p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "red",
                              paddingBottom: "10px",
                            }}
                          >
                            🚫 Non-Refundable
                          </p>

                          <div className="hotel-footer">
                            <div className="rating">
                              <span className="rating-badge">
                                {hotel.rating}
                              </span>
                              <span>
                                {hotel.rating >= 3 ? "Very Good" : "Good"}
                              </span>
                            </div>

                            <div className="price-info">
                              <p className="price">
                                {convertPrice(hotel.price)} {currency}
                                
                                </p>
                              <p className="price-sub">
                                {rooms.length} room(s) <br /> {nights} night(s)
                                incl. taxes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </main>
            )}

            {!showMap &&(
              
              <div className="map-con">
                <MapWithPrices />

              </div>
            )}
          </>
        )}

        {showPopup && (
          <div className="popup-overlay">
            {" "}
            <div className="popup">
              {" "}
              <MobFilter
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                handlePopupToggle={handlePopupToggle}
              />{" "}
            </div>{" "}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
