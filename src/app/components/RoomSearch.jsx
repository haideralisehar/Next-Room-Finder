// HotelSearchBar.jsx
// Updated component based on your CSS and required functionality

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

  const [formData, setFormData] = useState({
    destination: initialData?.destination || "",
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    rooms: initialData?.rooms || [{ adults: 1, children: 0, childrenAges: [] }],
  });

  

  console.log(formData);

  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [dateRange, setDateRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);

  const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const [dateRange, setDateRange] = useState([
  { startDate: today, endDate: tomorrow, key: "selection" },
]);

useEffect(() => {
  setFormData(prev => ({
    ...prev,
    checkIn: formatDate(dateRange[0].startDate),
    checkOut: formatDate(dateRange[0].endDate)
  }));
}, [dateRange]);


  const formatDate = (date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const handleDateApply = () => {
    setShowDatePicker(false);
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

  const handleCounter = (index, field, value) => {
    const updated = [...formData.rooms];

    // Children count adjustment
    if (field === "children") {
      updated[index].children = Math.max(0, updated[index].children + value);
      updated[index].childrenAges = Array.from({
        length: updated[index].children,
      }).map((_, i) => updated[index].childrenAges[i] || "0");
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

  // const submitSearch = () => {
  //   if (!formData.destination) {
  //     alert("Please select an destination!");
  //   } else {
  //     router.push(
  //       `/results?destination=${formData.destination}&checkIn=${
  //         formData.checkIn
  //       }&checkOut=${formData.checkOut}&rooms=${encodeURIComponent(
  //         JSON.stringify(formData.rooms)
  //       )}`
  //     );
  //   }
  // };

  const submitSearch = async () => {
  if (!formData.destination) {
    alert("Please select a destination!");
    return;
  }

  const totalRooms = formData.rooms.length;
  const totalAdults = formData.rooms.reduce((s, r) => s + r.adults, 0);

  const requestBody = {
    countryCode: formData.destination, // EX: "GB"
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

    // Navigate to Results page with API response as encoded data
    // router.push(
    //   `/results?data=${encodeURIComponent(JSON.stringify(data))}&destination=${formData.destination}&checkIn=${
    //       formData.checkIn
    //     }&checkOut=${formData.checkOut}&rooms=${encodeURIComponent(
    //       JSON.stringify(formData.rooms)
    //     )}`
    // );
    

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

    return `${totalRooms} Room${
      totalRooms > 1 ? "s" : ""
    }, ${totalAdults} Adults${
      totalChildren > 0 ? `, ${totalChildren} Children` : ""
    }`;
  };

  return (
    <div>
      <div className="search-bar">
        <div className="search-box">
          <FaSearch className="icon" />
          <CountrySelector
            selectedCountry={formData.destination}
            onCountrySelect={handleCountrySelect}
            show_label={false}
          />
        </div>

        {/* Date Range */}
        <div className="search-box date-box">
          <FaCalendarAlt className="icon" />
          <input
            readOnly
            value={
              formData.checkIn && formData.checkOut
                ? `${formData.checkIn} → ${formData.checkOut}`
                : "Check-in — Check-out"
            }
            onClick={() => setShowDatePicker(true)}
          />

          {/* {showDatePicker && (
            <div className="date-picker-popup">
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                onChange={(item) => {
                  const range = item.selection;
                  setDateRange([range]);

                  // UPDATE STATE LIVE
                  setFormData((prev) => ({
                    ...prev,
                    checkIn: formatDate(range.startDate),
                    checkOut: formatDate(range.endDate),
                  }));
                }}
              />

              <div className="footer-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
                <button className="apply-btn" onClick={handleDateApply}>
                  Apply
                </button>
              </div>
            </div>
          )} */}
          {showDatePicker && (
  <div className="date-picker-popup">
    <DateRange
      ranges={dateRange}
      minDate={today}
      moveRangeOnFirstSelection={false}
      onChange={(ranges) => {
        const { startDate, endDate } = ranges.selection;

        // Prevent endDate < startDate
        const validEndDate = endDate < startDate ? startDate : endDate;

        setDateRange([
          {
            startDate,
            endDate: validEndDate,
            key: "selection",
          },
        ]);
      }}
    />

    <div className="footer-buttons">
      <button
        className="cancel-btn"
        onClick={() => {
          // Reset back to previously saved formData
          setDateRange([
            {
              startDate: new Date(formData.checkIn),
              endDate: new Date(formData.checkOut),
              key: "selection",
            },
          ]);

          setShowDatePicker(false);
        }}
      >
        Cancel
      </button>

      <button
        className="apply-btn"
        onClick={() => {
          // Apply already synced values
          setShowDatePicker(false);
        }}
      >
        Apply
      </button>
    </div>
  </div>
)}

        </div>

        {/* Rooms */}
        <div className="search-box" onClick={() => setShowRoomPopup(true)}>
          <FaUser className="icon" />
          <input readOnly value={getRoomSummary()} />
        </div>

        <button className="search-btn" onClick={submitSearch}>
          <FaSearch /> Search Hotels
        </button>
      </div>

      {/* ------------ POPUP FOR ROOMS ------------ */}
      {showRoomPopup && (
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
            <button
              className="close-btn"
              onClick={() => setShowRoomPopup(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

