import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "../styling/RoomFilter.css";

const roomTypes = [
  { label: "Room Only", value: 1 },
  { label: "Bed and Breakfast", value: 2 },
  { label: "Half Board", value: 3 },
  { label: "Full Board", value: 4 },
  { label: "All Inclusive", value: 5 },
  { label: "Dinner", value: 6 },
  { label: "Breakfast and Dinner", value: 7 },
  { label: "Breakfast And Lunch", value: 8 },
  { label: "Lunch", value: 9 },
  { label: "Lunch And Dinner", value: 10 },
  { label: "Lunch or Dinner", value: 11 },
  { label: "Breakfast + Lunch / Dinner", value: 12 },
  { label: "Suhur", value: 13 },
  { label: "Iftar", value: 14 },
  { label: "Suhur and Iftar", value: 15 },
  { label: "Suhur or Iftar", value: 16 },
];

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
    <option key={type.value} value={type.value}>
      {type.label}
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
