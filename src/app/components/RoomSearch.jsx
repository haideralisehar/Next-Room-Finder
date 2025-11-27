"use client";
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaUser,
  FaMinus,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styling/HotelSearchBar.css";
import CountrySelector from "../components/CountrySelector";

export default function HotelSearchBar({ initialData }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false); // ✅ ADDED LOADING STATE

  const [formData, setFormData] = useState({
    destination: initialData?.destination || "",
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    rooms: initialData?.rooms || [{ adults: 1, children: 0, childrenAges: [] }],
  });

  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState([
    { startDate: today, endDate: tomorrow, key: "selection" },
  ]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      checkIn: formatDate(dateRange[0].startDate),
      checkOut: formatDate(dateRange[0].endDate),
    }));
  }, [dateRange]);

  const formatDate = (date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  // ⭐ SUBMIT SEARCH WITH LOADER
  const submitSearch = async () => {
    if (!formData.destination) {
      alert("Please select a destination!");
      return;
    }

    setLoading(true); // ⬅️ SHOW LOADER

    const totalRooms = formData.rooms.length;
    const totalAdults = formData.rooms.reduce((s, r) => s + r.adults, 0);

    const requestBody = {
      countryCode: formData.destination,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      rooms: totalRooms,
      adults: totalAdults,
      currency: "USD",
      nationality: formData.destination,
    };

    try {
      const res = await fetch("/api/hotelsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log("API Response:", data);

      sessionStorage.setItem("hotelData", JSON.stringify(data));

      router.push(
        `/results?destination=${formData.destination}&checkIn=${
          formData.checkIn
        }&checkOut=${formData.checkOut}&rooms=${encodeURIComponent(
          JSON.stringify(formData.rooms)
        )}`
      );
    } catch (error) {
      console.error("Search API error:", error);
      alert("Error fetching hotel data.");
    } finally {
      setLoading(false); // ⬅️ HIDE LOADER
    }
  };

  const handleCountrySelect = (countryName) => {
    setFormData((prev) => ({
      ...prev,
      destination: countryName.code,
    }));
  };

  const getRoomSummary = () => {
    const totalRooms = formData.rooms.length;
    const totalAdults = formData.rooms.reduce((s, r) => s + r.adults, 0);
    const totalChildren = formData.rooms.reduce((s, r) => s + r.children, 0);
    return `${totalRooms} Room${totalRooms > 1 ? "s" : ""}, ${totalAdults} Adults${
      totalChildren > 0 ? `, ${totalChildren} Children` : ""
    }`;
  };

  return (
    <>
      {/* ⭐ LOADER OVERLAY ⭐ */}
      {loading && (
          <div className="loading-container">
            <div className="box" >
          <div className="spinner"></div>
          <p style={{fontSize:"12px"}}>Please Wait...</p>
          </div>
        </div>
      )}

      <div className={`search-bar ${loading ? "disabled" : ""}`}>
        <div className="search-box">
          <FaSearch className="icon" />
          <CountrySelector
            selectedCountry={formData.destination}
            onCountrySelect={handleCountrySelect}
            show_label={false}
          />
        </div>

        {/* DATE RANGE SELECTOR */}
        <div className="search-box date-box">
          <FaCalendarAlt className="icon" />
          <input
            readOnly
            value={`${formData.checkIn} → ${formData.checkOut}`}
            onClick={() => !loading && setShowDatePicker(true)}
          />

          {showDatePicker && (
            <div className="date-picker-popup">
              <DateRange
                ranges={dateRange}
                minDate={today}
                moveRangeOnFirstSelection={false}
                onChange={(ranges) => {
                  const { startDate, endDate } = ranges.selection;
                  setDateRange([
                    {
                      startDate,
                      endDate: endDate < startDate ? startDate : endDate,
                      key: "selection",
                    },
                  ]);
                }}
              />

              <div className="footer-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>

                <button
                  className="apply-btn"
                  onClick={() => setShowDatePicker(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ROOMS */}
        <div className="search-box" onClick={() => !loading && setShowRoomPopup(true)}>
          <FaUser className="icon" />
          <input readOnly value={getRoomSummary()} />
        </div>

        {/* SEARCH BUTTON */}
        <button className="search-btn" onClick={submitSearch} disabled={loading}>
          <FaSearch /> {loading ? "Searching..." : "Search Hotels"}
        </button>
      </div>

      {/* ROOM POPUP (If Not Loading) */}
      {!loading && showRoomPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="pop-top">
              <div className="title"><p>Select Rooms</p></div>
              <button onClick={() => setShowRoomPopup(false)}>✖</button>
            </div>

            {formData.rooms.map((room, index) => (
              <div key={index} className="room-section">
                <div className="room-header">
                  <h3>Room {index + 1}</h3>
                  {index > 0 && (
                    <button
                      className="delete-room-btn"
                      onClick={() => handleRemoveRoom(index)}
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>

                <div className="counter">
                  <label>Adults</label>
                  <button onClick={() => handleCounter(index, "adults", -1)}>
                    <FaMinus />
                  </button>
                  <span>{room.adults}</span>
                  <button onClick={() => handleCounter(index, "adults", 1)}>
                    <FaPlus />
                  </button>
                </div>

                <div className="counter">
                  <label>Children</label>
                  <button onClick={() => handleCounter(index, "children", -1)}>
                    <FaMinus />
                  </button>
                  <span>{room.children}</span>
                  <button onClick={() => handleCounter(index, "children", 1)}>
                    <FaPlus />
                  </button>
                </div>

                {room.children > 0 && (
                  <div className="children-ages">
                    {room.childrenAges.map((age, i) => (
                      <div key={i} className="child-age">
                        <label>Child {i + 1} Age</label>
                        <select
                          value={age}
                          onChange={(e) =>
                            handleChildrenAgeChange(index, i, e.target.value)
                          }
                        >
                          {Array.from({ length: 18 }).map((_, age) => (
                            <option key={age} value={age}>
                              {age}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button className="add-room-btn" onClick={handleAddRoom}>
              + Add Room
            </button>
            <button className="close-btn" onClick={() => setShowRoomPopup(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
