"use client";
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaSearch,
  FaUser,
  FaUserAlt ,

  FaMinus,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";

import { MdPerson } from "react-icons/md";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styling/HotelSearchBar.css";
import CountrySelector from "../components/CountrySelector";

export default function HotelSearchBar({ initialData }) {
  const router = useRouter();

  const [loadingfetch, setLoadingfetch] = useState(false); // loader

  const [formData, setFormData] = useState({
    destination: initialData?.destination || "",
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    starRating: initialData?.starRating || "3",   // ⭐ NEW FIELD
    rooms:
      initialData?.rooms && Array.isArray(initialData.rooms) && initialData.rooms.length > 0
        ? initialData.rooms
        : [{ adults: 1, children: 0, childrenAges: [] }],
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

  // ----------------------------
  // Room management functions (added back)
  // ----------------------------
  const handleAddRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          adults: 1,
          children: 0,
          childrenAges: [],
        },
      ],
    }));
  };

  const handleRemoveRoom = (index) => {
    if (formData.rooms.length === 1) return;
    const updated = [...formData.rooms];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, rooms: updated }));
  };

  const handleCounter = (index, field, value) => {
    const updated = [...formData.rooms];

    if (field === "children") {
      updated[index].children = Math.max(0, updated[index].children + value);
      updated[index].childrenAges = Array.from(
        { length: updated[index].children },
        (_, i) => updated[index].childrenAges[i] ?? "0"
      );
    } else {
      updated[index][field] = Math.max(1, updated[index][field] + value);
    }

    setFormData((prev) => ({ ...prev, rooms: updated }));
  };

  const handleChildrenAgeChange = (roomIndex, childIndex, newAge) => {
    const updated = [...formData.rooms];
    updated[roomIndex].childrenAges[childIndex] = newAge;
    setFormData((prev) => ({ ...prev, rooms: updated }));
  };
  // ----------------------------

  // Submit search -> call backend route, save response to sessionStorage, navigate
  const submitSearch = async () => {
    if (!formData.destination && !formData.starRating) {
      alert("Please select a destination!");
      return;
    }

    setLoadingfetch(true);

    const totalRooms = formData.rooms.length;
    
    const totalAdults = formData.rooms.reduce((s, r) => s + r.adults, 0);
    
    console.log(totalRooms);
    const requestBody = {
      countryCode: formData.destination,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      rooms: totalRooms,
      adults: totalAdults,
      currency: "USD",
      nationality: formData.destination,
      starRating: formData.starRating ? Number(formData.starRating) : null, // ⭐ NEW
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
      
window.dispatchEvent(new Event("hotelDataUpdated"));

    

      router.push(
        `/results?destination=${formData.destination}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&rooms=${encodeURIComponent(
          JSON.stringify(formData.rooms)
        )}&starRating=${formData.starRating}`
      );
    } catch (error) {
      console.error("Search API error:", error);
      alert("Error fetching hotel data.");
    } finally {
      setLoadingfetch(false);
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
      {/* loader overlay */}
      {loadingfetch && (
       <div className="loading-container">
  <div className="box">
    <Image
      className="circular-left-right"
      src="/loading_ico.png"
      alt="Loading"
      width={200}
      height={200}
    />
    <p style={{ fontSize: "13px" }}>Please Wait...</p>
  </div>
</div>

      )}
 {/* <div className="spinner"></div> */}
      <div className={`search-bar ${loadingfetch ? "disabled" : ""}`}>
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
          
           {/* 𝄜 */}
          <input
            readOnly
            value={
              formData.checkIn && formData.checkOut
                ? `${formData.checkIn} → ${formData.checkOut}`
                : "Check-in — Check-out"
            }
            onClick={() => !loadingfetch && setShowDatePicker(true)}
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

        {/*startRaTING */}

        {/* STAR RATING DROPDOWN */}
<div className="search-box-rate">
  <select
    value={formData.starRating}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, starRating: e.target.value }))
    }
  >
    <option value="">Star Rating</option>
    <option value="1">1+ star</option>
    <option value="2">2+ star</option>
    <option value="3">3+ star</option>
    <option value="4">4+ star</option>
    <option value="5">5+ star</option>
  </select>
</div>


        {/* ROOMS */}
        <div
          className="search-box"
          onClick={() => !loadingfetch && setShowRoomPopup(true)}
        >
          <MdPerson size={17}  className="icon" />
          {/* <p style={{color:"black"}}>👤</p> */}
          <input readOnly value={getRoomSummary()} />
        </div>

        {/* SEARCH BUTTON */}
        <button
          className="search-btn"
          onClick={submitSearch}
          disabled={loadingfetch}
        >
          {/* <FaSearch />  */}
          Search
        </button>
      </div>

      {/* ROOM POPUP (If Not Loading) */}
      {!loadingfetch && showRoomPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="pop-top">
              <div className="title">
                <p>Select Rooms</p>
              </div>
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

                {/* Adults */}
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

                {/* Children */}
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

                {/* Children Ages */}
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
                          {Array.from({ length: 18 }).map((_, ageVal) => (
                            <option key={ageVal} value={ageVal}>
                              {ageVal}
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
            <button
              className="close-btn-do"
              onClick={() => setShowRoomPopup(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
