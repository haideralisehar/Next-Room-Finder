import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "../styling/RoomFilter.css";

const roomTypes = ["Room Only", "Bed and Breakfast", "Half Board", "Full Board"];
const refundOptions = ["Refundable", "Non-Refundable"];
const cancelOption = ["Free Cancelation", "Paid Cancelation"];

export default function HotelFilterBar({ onFilterChange }) {
  const [roomType, setRoomType] = useState("");
  const [refund, setRefund] = useState("");
  const [freeCancel, setFreeCancel] = useState("");
  const [roomName, setRoomName] = useState("");

  const applyFilters = (e) => {
    if (e) e.preventDefault(); // ✅ prevent page reload
    onFilterChange({
      roomType,
      refund,
      freeCancel,
      roomName,
    });
  };

  const clearFilters = () => {
    setRoomType("");
    setRefund("");
    setFreeCancel("");
    setRoomName("");

    onFilterChange({
      roomType: "",
      refund: "",
      freeCancel: "",
      roomName: "",
    });
  };

  return (
    <form className="filter-bar" onSubmit={applyFilters}>
      <div className="filter-item">
        <label>Room Type</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Refund</label>
        <select value={refund} onChange={(e) => setRefund(e.target.value)}>
          <option value="">Select Refund Option</option>
          {refundOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Cancellation Type</label>
        <select value={freeCancel} onChange={(e) => setFreeCancel(e.target.value)}>
          <option value="">Select Cancelation</option>
          {cancelOption.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Find Room</label>
        <input
          type="text"
          placeholder="Search room..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      <button type="submit" className="filter-btn">
        <FaSearch /> Search
      </button>

      <button type="button" className="filter-btn clear-btn" onClick={clearFilters}>
        <FaTimes /> Clear
      </button>
    </form>
  );
}
