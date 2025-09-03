"use client"
import React, { useState } from "react";
import "../styling/Banner.css";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";

const Banner = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  // Rooms state
  const [rooms, setRooms] = useState([
    { adults: 2, children: 0, childrenAges: [] }, // Default Room 1
  ]);

  // Toggle popup
  const handlePopupToggle = () => setShowPopup(!showPopup);

  // Increment / Decrement Adults & Children
  const updateCount = (roomIndex, type, operation) => {
  setRooms((prevRooms) =>
    prevRooms.map((room, i) => {
      if (i !== roomIndex) return room;

      // Create a copy of the room
      const updatedRoom = { ...room };

      if (operation === "increment") {
        updatedRoom[type] += 1;
      }
      if (operation === "decrement" && updatedRoom[type] > 0) {
        updatedRoom[type] -= 1;
      }

      // If children changed, adjust childrenAges array
      if (type === "children") {
        if (updatedRoom[type] > updatedRoom.childrenAges.length) {
          updatedRoom.childrenAges = [
            ...updatedRoom.childrenAges,
            null,
          ];
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


  // Handle child age selection
  const handleChildAgeChange = (roomIndex, childIndex, age) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex].childrenAges[childIndex] = age;
      return updatedRooms;
    });
  };

  // Add new room
  const addRoom = () => {
    setRooms((prevRooms) => [
      ...prevRooms,
      { adults: 2, children: 0, childrenAges: [] },
    ]);
  };

  // Delete a room
  const deleteRoom = (roomIndex) => {
    setRooms((prevRooms) => prevRooms.filter((_, i) => i !== roomIndex));
  };

  // Get summary string
  const getSummary = () => {
    let totalRooms = rooms.length;
    let totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
    let totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);
    return `${totalRooms} Room${totalRooms > 1 ? "s" : ""}, ${totalAdults} Adults${
      totalChildren > 0 ? `, ${totalChildren} Children` : ""
    }`;
  };

  return (
    <section className="banner">
      <div className="banner-overlay">
        <div className="banner-content">
          <h1>Let’s book your trips!</h1>
          <p>Choose from over 2+ million hotels worldwide!</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          {/* Destination */}
          <div className="search-box">
            <FaMapMarkerAlt className="icon" />
            <input type="text" placeholder="Enter a destination" />
          </div>

          {/* Dates */}
          <div className="search-box date-box">
            <FaCalendarAlt className="icon" />
            <div className="date-inputs">
              <label className="date-label">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="date-separator">-</span>

              <label className="date-label">To</label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Rooms / Guests */}
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
          <button className="search-btn">
            <FaSearch className="btn-icon" /> Search Hotels
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" >
          <div className="popup">
            <div className="pop-top">
              <div className="title">
        <p>Configuring Rooms</p>
              </div>
             
            </div>
            <hr />
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="room-section">
                <div className="room-header">
                  <h3>Room {roomIndex + 1}</h3>

                  {/* Show delete button only if it's not the first room */}
                  {roomIndex > 0 && (
                    <button
                      className="delete-room-btn"
                      onClick={() => deleteRoom(roomIndex)}
                    >
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>

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

            {/* Add New Room */}
            <button className="add-room-btn" onClick={addRoom}>
              + Add Room
            </button>

            {/* Close Popup */}
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;