// src/components/RoomSearch.jsx  (replace your existing file)
"use client";
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaSearch,
  FaUser,
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

import { useDispatch, useSelector } from "react-redux";
import {
  setSearchPayload,
  performSearchThunk,
} from "../redux/searchSlice";

export default function HotelSearchBar({ initialData, onClearFilters }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchState = useSelector((s) => s.search);

  const [loadingfetch, setLoadingfetch] = useState(false);

  const [formData, setFormData] = useState({
    destination: initialData?.destination || "",
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    starRating: initialData?.starRating || "3",
    rooms:
      initialData?.rooms && Array.isArray(initialData.rooms) && initialData.rooms.length > 0
        ? initialData.rooms
        : [{ adults: 1, children: 0, childrenAges: [] }],
  });

  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [maxPeopleRoom, setMaxPeopleRoom] = useState([]);


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

   const getMaxPeopleRoom = () => {
  if (!formData.rooms || formData.rooms.length === 0) return [];

  const sorted = [...formData.rooms].sort((a, b) => {
    const totalA = a.adults + a.children;
    const totalB = b.adults + b.children;
    return totalB - totalA;
  });

  return [sorted[0]]; // return as array 👈 IMPORTANT
  
};


console.log(formData.rooms)

 const handleCounter = (index, field, value) => {
  const updated = formData.rooms.map((room, i) => {
    if (i !== index) return room; // keep unchanged

    const currentTotal = room.adults + room.children;

    // If trying to increase and total is already 4 → STOP
    if (value === 1 && currentTotal >= 4) {
      return room;
    }

    if (field === "children") {
      const newChildren = Math.max(0, room.children + value);

      // If adding a child makes total > 4 → STOP
      if (room.adults + newChildren > 4) return room;

      return {
        ...room,
        children: newChildren,
        childrenAges: Array.from(
          { length: newChildren },
          (_, i) => room.childrenAges[i] ?? "0"
        ),
      };
    }

    if (field === "adults") {
      const newAdults = Math.max(1, room.adults + value);

      // If adding an adult makes total > 4 → STOP
      if (newAdults + room.children > 4) return room;

      return {
        ...room,
        adults: newAdults,
      };
    }

    return room; // fallback
  });

  setFormData((prev) => ({
    ...prev,
    rooms: updated,
  }));
};



  const handleChildrenAgeChange = (roomIndex, childIndex, newAge) => {
    const updated = [...formData.rooms];
    updated[roomIndex].childrenAges[childIndex] = newAge;
    setFormData((prev) => ({ ...prev, rooms: updated }));
  };

  const submitSearch = async () => {
    if (!formData.destination) {
      alert("Please select a destination!");
      return;
    }

    setLoadingfetch(true);

    const totalRooms = formData.rooms.length;
    const totalAdults = formData.rooms.reduce((s, r) => s + r.adults, 0);
    const totalChildren = formData.rooms.reduce((s, r) => s + r.children, 0);

    const allChildAges = formData.rooms
      .flatMap((r) => r.childrenAges)
      .map((age) => Number(age));

      


    const requestBody = {
      countryCode: formData.destination,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      rooms: totalRooms,
       room: formData.rooms,
      adults: maxPeopleRoom?.[0]?.adults,
      children: maxPeopleRoom?.[0]?.children,
      childAges: maxPeopleRoom?.[0]?.childrenAges,
      currency: "USD",
      nationality: formData.destination,
      starRating: formData.starRating ? Number(formData.starRating) : null,
    };

    

    // Save request for reuse in Redux
    dispatch(setSearchPayload(requestBody));

   

    // Dispatch thunk to perform search and save results in Redux
    await dispatch(performSearchThunk(requestBody));

    // navigate to results page (keeps previous query string behavior)
    router.push(
      `/results?destination=${formData.destination}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&rooms=${encodeURIComponent(
        JSON.stringify(formData.rooms)
      )}&starRating=${formData.starRating}`
    );

    setLoadingfetch(false);
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

      <div className={`search-bar ${loadingfetch ? "disabled" : ""}`}>
        <div className="search-boxes">
          <FaSearch className="icon" />

          <CountrySelector
            selectedCountry={formData.destination}
            onCountrySelect={handleCountrySelect}
            show_label={false}
          />
        </div>

        <div className="search-box date-box">
          <FaCalendarAlt className="icon" />
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

        <div
          className="search-box"
          onClick={() => !loadingfetch && setShowRoomPopup(true)}
        >
          <MdPerson size={17} className="icon" />
          <input readOnly value={getRoomSummary()} />
        </div>

        <button className="search-btn" onClick={submitSearch} disabled={loadingfetch}>
          Search
        </button>
      </div>

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
                    <button className="delete-room-btn" onClick={() => handleRemoveRoom(index)}>
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
                          onChange={(e) => handleChildrenAgeChange(index, i, e.target.value)}
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
  onClick={() => {
    const maxRoom = getMaxPeopleRoom(); // returns array

    setMaxPeopleRoom(maxRoom); // update state once

    // console.log("Updated value:", maxRoom);

    setShowRoomPopup(false);
  }}
>
  Done
</button>



          </div>
        </div>
      )}
    </>
  );
}
