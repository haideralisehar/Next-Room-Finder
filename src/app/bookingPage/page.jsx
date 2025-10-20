"use client";
import React, { useState, useEffect } from "react";
import "./mybooking.css";
import Header from "../components/Header";

export default function MyBookingsPage() {
  const [filters, setFilters] = useState({
    bookingId: "",
    reservationStatus: "",
    serviceType: "All",
    leaderName: "",
  });

  const [results, setResults] = useState([]);

  const dummyBookings = [
    { id: "B001", leader: "John Smith", status: "Confirmed", service: "Hotel", date: "2025-10-10" },
    { id: "B002", leader: "Alice Johnson", status: "Pending", service: "Flight", date: "2025-09-28" },
    { id: "B003", leader: "David Lee", status: "Cancelled", service: "Hotel", date: "2025-08-10" },
    { id: "B004", leader: "Lee", status: "Confirmed", service: "Hotel", date: "2025-08-10" },
    { id: "B005", leader: "King Sultan", status: "Pending", service: "Hotel", date: "2025-09-10" },
    { id: "B006", leader: "Line Stone", status: "Cancelled", service: "Hotel", date: "2025-08-10" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filtered = dummyBookings.filter((b) => {
      return (
        (!filters.bookingId || b.id.toLowerCase().includes(filters.bookingId.toLowerCase())) &&
        (!filters.leaderName || b.leader.toLowerCase().includes(filters.leaderName.toLowerCase())) &&
        (!filters.reservationStatus || b.status === filters.reservationStatus) &&
        (filters.serviceType === "All" || b.service === filters.serviceType)
      );
    });
    setResults(filtered);
  };

  const handleReset = () => {
    setFilters({
      bookingId: "",
      reservationStatus: "",
      serviceType: "All",
      leaderName: "",
    });
    setResults([]);
  };

  // ✅ Press "Enter" to trigger search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filters]);

  return (
    <>
      <Header />
      <div className="rprt">My Bookings</div>

      <div className="booki">
        <div className="filter-section">
          <div className="filter-row">
            <div className="input-box">
              <label>Booking ID</label>
              <input
                type="text"
                name="bookingId"
                value={filters.bookingId}
                onChange={handleChange}
                placeholder="Enter Booking ID"
              />
            </div>

            <div className="select-box">
              <label>Reservation Status</label>
              <select
                name="reservationStatus"
                value={filters.reservationStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="select-box">
              <label>Service Type</label>
              <select
                name="serviceType"
                value={filters.serviceType}
                onChange={handleChange}
              >
                <option>All</option>
                <option>Hotel</option>
              </select>
            </div>

            <div className="input-box">
              <label>Leader Name</label>
              <input
                type="text"
                name="leaderName"
                value={filters.leaderName}
                onChange={handleChange}
                placeholder="Enter Leader Name"
              />
            </div>

            <div className="buttons">
              <button className="search-btn" onClick={handleSearch}>
                SEARCH
              </button>
              <button className="reset-btn" onClick={handleReset}>
                RESET
              </button>
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="rprt-rslt">{results.length} - Result(s) Found</div>
        ) : (
          ""
        )}

        <div className="results">
          {results.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Leader Name</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.leader}</td>
                    <td>{r.status}</td>
                    <td>{r.service}</td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No bookings found.</p>
          )}
        </div>
      </div>
    </>
  );
}
