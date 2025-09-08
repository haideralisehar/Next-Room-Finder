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
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/HotelSearchBar.css";
import { useRouter } from "next/navigation";

const destinations = ["Islamabad", "Lahore"];

export default function HotelSearchBar({
  initialDestination = "",
  initialCheckIn = null,
  initialCheckOut = null,
  initialRooms = [{ adults: 1, children: 0, childrenAges: [] }],
}) {
  const router = useRouter();

  const [destination, setDestination] = useState(initialDestination);

  // ✅ Default dates: check-in today, check-out tomorrow
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
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Calculate number of nights
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

  const updateCount = (roomIndex, type, operation) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) => {
        if (i !== roomIndex) return room;
        const updatedRoom = { ...room };
        if (operation === "increment") updatedRoom[type] += 1;
        if (operation === "decrement" && updatedRoom[type] > 0)
          updatedRoom[type] -= 1;

        if (type === "children") {
          if (updatedRoom[type] > updatedRoom.childrenAges.length) {
            updatedRoom.childrenAges = [...updatedRoom.childrenAges, null];
          } else {
            updatedRoom.childrenAges = updatedRoom.childrenAges.slice(
              0,
              updatedRoom[type]
            );
          }
        }
        return updatedRoom;
      })
    );
  };

  const handleChildAgeChange = (roomIndex, childIndex, age) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex].childrenAges[childIndex] = age;
      return updatedRooms;
    });
  };

  const addRoom = () =>
    setRooms([...rooms, { adults: 2, children: 0, childrenAges: [] }]);
  const deleteRoom = (roomIndex) =>
    setRooms(rooms.filter((_, i) => i !== roomIndex));

  const CloseDone =()=>{
    // Normalize: capitalize first letter, lowercase the rest
    // const normalizedDest =
    //   destination.charAt(0).toUpperCase() +
    //   destination.slice(1).toLowerCase();
    // const searchUrl = `/results?destination=${normalizedDest}&from=${checkInDate?.toISOString()}&to=${checkOutDate?.toISOString()}&rooms=${encodeURIComponent(
    //   JSON.stringify(rooms)
    // )}&nights=${nights}`;
  
    setShowPopup(false);
    // Decide whether to push or replace
    // if (window.location.pathname === "/") {
    //   router.push(searchUrl);
    // } else {
    //   router.replace(searchUrl);
    // }

  }

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
    // Normalize: capitalize first letter, lowercase the rest
    const normalizedDest =
      destination.charAt(0).toUpperCase() +
      destination.slice(1).toLowerCase();
    const searchUrl = `/results?destination=${normalizedDest}&from=${checkInDate?.toISOString()}&to=${checkOutDate?.toISOString()}&rooms=${encodeURIComponent(
      JSON.stringify(rooms)
    )}&nights=${nights}&description=${destinations}`;

    // Decide whether to push or replace
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

        {/* ✅ Show Nights */}
        {/* <div className="search-box">
          <p>{nights} Night{nights > 1 ? "s" : ""}</p>
        </div> */}

        {/* Guests */}
        <div className="search-box" onClick={handlePopupToggle}>
          <FaUsers className="icon" />
          <input
            type="text"
            placeholder="1 Room, 2 Adults"
            value={getSummary()}
            readOnly
          />
        </div>

        {/* Search Button */}
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch /> Search Hotels
        </button>
      </div>
     

      {/* 🔹 Multi-room Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="room-section">
                <h3>Room {roomIndex + 1}</h3>
                {roomIndex > 0 && (
                  <button
                    className="delete-room-btn"
                    onClick={() => deleteRoom(roomIndex)}
                  >
                    <FaTrash /> Remove
                  </button>
                )}

                {/* Adults */}
                <div className="counter">
                  <label>Adults</label>
                  <button
                    onClick={() => updateCount(roomIndex, "adults", "decrement")}
                  >
                    <FaMinus />
                  </button>
                  <span>{room.adults}</span>
                  <button
                    onClick={() => updateCount(roomIndex, "adults", "increment")}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Children */}
                <div className="counter">
                  <label>Children</label>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "children", "decrement")
                    }
                  >
                    <FaMinus />
                  </button>
                  <span>{room.children}</span>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "children", "increment")
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Children Ages */}
                {room.children > 0 && (
                  <div className="children-ages">
                    {room.childrenAges.map((age, childIndex) => (
                      <div key={childIndex} className="child-age">
                        <label>Child {childIndex + 1} Age:</label>
                        <select
                          value={age || ""}
                          onChange={(e) =>
                            handleChildAgeChange(
                              roomIndex,
                              childIndex,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Age</option>
                          {Array.from({ length: 16 }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="add-room-btn" onClick={addRoom}>
              + Add Room
            </button>
            <button className="close-btn" onClick={CloseDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
