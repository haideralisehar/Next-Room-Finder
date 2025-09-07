"use client";
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/HotelSearchBar.css";
import { useRouter } from "next/navigation";
import Filters from "../components/filter"; // ✅ Import Filters component

// ✅ Static Hotel Data
export const hotelsData = {
  Islamabad: [
    {
      id: 1,
      name: "Islamabad Serena Hotel",
      location: "Khaliq Uz Zaman Road, Islamabad",
      price: 120,
      image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
      rating: 5,
    },
    {
      id: 2,
      name: "Marriott Islamabad",
      location: "Agha Khan Road, Islamabad",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600",
      rating: 4,
    },
  ],
};

const destinations = ["Islamabad", "Lahore"];

export default function HotelSearchBar({
  initialDestination = "",
  initialCheckIn = null,
  initialCheckOut = null,
  initialRooms = [{ adults: 2, children: 0, childrenAges: [] }],
}) {
  const router = useRouter();
  const [destination, setDestination] = useState(initialDestination);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(
    initialCheckIn ? new Date(initialCheckIn) : today
  );
  const [checkOutDate, setCheckOutDate] = useState(
    initialCheckOut ? new Date(initialCheckOut) : tomorrow
  );

  const [rooms, setRooms] = useState(initialRooms);
  const [showPopup, setShowPopup] = useState(false); // Room popup
  const [showFilterPopup, setShowFilterPopup] = useState(false); // Filter popup ✅

  // ✅ Nights calculation
  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const handlePopupToggle = () => setShowPopup(!showPopup);

  const handleFilterPopupToggle = () => setShowFilterPopup(!showFilterPopup); // ✅

  const getSummary = () => {
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
    const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);
    return `${totalRooms} Room${totalRooms > 1 ? "s" : ""}, ${totalAdults} Adults${
      totalChildren > 0 ? `, ${totalChildren} Children` : ""
    }`;
  };

  const handleSearch = () => {
    if (!destination) {
      alert("Please enter a destination!");
      return;
    }
    const normalizedDest =
      destination.charAt(0).toUpperCase() +
      destination.slice(1).toLowerCase();

    const searchUrl = `/results?destination=${normalizedDest}&from=${checkInDate?.toISOString()}&to=${checkOutDate?.toISOString()}&rooms=${encodeURIComponent(
      JSON.stringify(rooms)
    )}&nights=${nights}`;

    if (window.location.pathname === "/") {
      router.push(searchUrl);
    } else {
      router.replace(searchUrl);
    }
  };

  return (
    <div>
      {/* 🔹 Search Bar */}
      <div className="search-bar">
        {/* Destination */}
        <div className="search-box">
          <FaMapMarkerAlt className="icon" />
          <input
            type="text"
            placeholder="Enter destination"
            list="destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <datalist id="destinations">
            {destinations.map((place, i) => (
              <option key={i} value={place} />
            ))}
          </datalist>
        </div>

        {/* Dates */}
        <div className="search-box date-box">
          <FaCalendarAlt className="icon" />
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            placeholderText="Check-in"
          />
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate}
            placeholderText="Check-out"
          />
        </div>

        {/* Guests */}
        <div className="search-box" onClick={handlePopupToggle}>
          <FaUsers className="icon" />
          <input type="text" value={getSummary()} readOnly />
        </div>

        {/* Buttons */}
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch /> Search Hotels
        </button>

        
      </div>

      {/* 🔹 Filter Popup ✅ */}
      {showFilterPopup && (
        <div className="popup-overlay">
          <div className="popup filter-popup">
            <button
              className="close-btn"
              onClick={handleFilterPopupToggle}
              style={{ float: "right", marginBottom: "10px" }}
            >
              <FaTimes /> Close
            </button>
            <h2>Filter Hotels</h2>
            <Filters /> {/* ✅ Imported component */}
          </div>
        </div>
      )}
    </div>
  );
}
