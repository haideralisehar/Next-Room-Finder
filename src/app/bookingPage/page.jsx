

"use client";
import React, { useState } from "react";
import "./mybooking.css";
import Header from "../components/Header"
export default function MyBookingsPage() {
  const [filters, setFilters] = useState({
    bookingId: "",
    leaderName: "",
    reservationStatus: "",
    serviceType: "All",
    subType: "subAgent",
    platform: [],
    showBookingDate: false,
    showServiceDate: false,
    showDeadlineDate: false,
    showStatusDate: false,
    showPastBookings: false,
  });

  const [results, setResults] = useState([]);

  // Dummy booking data
  const dummyBookings = [
    {
      id: "B001",
      leader: "John Smith",
      status: "Confirmed",
      service: "Hotel",
      platform: "Web",
      date: "2025-10-10",
    },
    {
      id: "B002",
      leader: "Alice Johnson",
      status: "Pending",
      service: "Flight",
      platform: "Mobile",
      date: "2025-09-28",
    },
    {
      id: "B003",
      leader: "David Lee",
      status: "Cancelled",
      service: "Hotel",
      platform: "Android",
      date: "2025-08-10",
    },
    {
      id: "B004",
      leader: "Michael Brown",
      status: "Confirmed",
      service: "Tour",
      platform: "IOS",
      date: "2025-10-05",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "platform") {
        setFilters((prev) => {
          const updated = checked
            ? [...prev.platform, value]
            : prev.platform.filter((p) => p !== value);
          return { ...prev, platform: updated };
        });
      } else {
        setFilters((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    let filtered = dummyBookings.filter((b) => {
      return (
        (!filters.bookingId ||
          b.id.toLowerCase().includes(filters.bookingId.toLowerCase())) &&
        (!filters.leaderName ||
          b.leader.toLowerCase().includes(filters.leaderName.toLowerCase())) &&
        (!filters.reservationStatus ||
          b.status.toLowerCase() === filters.reservationStatus.toLowerCase()) &&
        (filters.serviceType === "All" || b.service === filters.serviceType) &&
        (filters.platform.length === 0 ||
          filters.platform.includes(b.platform))
      );
    });
    setResults(filtered);
  };

  const handleReset = () => {
    setFilters({
      bookingId: "",
      leaderName: "",
      reservationStatus: "",
      serviceType: "All",
      subType: "subAgent",
      platform: [],
      showBookingDate: false,
      showServiceDate: false,
      showDeadlineDate: false,
      showStatusDate: false,
      showPastBookings: false,
    });
    setResults([]);
  };

  return (
    <>
    <Header/>
    
    <div className="rprt">My Booking</div>
    <div className="booki">
      <div className="filter-section">
        <div className="top-row">
          <div className="input-box">
            <label>Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={filters.bookingId}
              onChange={handleChange}
              placeholder="Enter your Booking ID"
            />
          </div>

          <div className="checkboxes">
            <label>
              <input
                type="checkbox"
                name="showBookingDate"
                checked={filters.showBookingDate}
                onChange={handleChange}
              />{" "}
              Show Booking Date
            </label>
            <label>
              <input
                type="checkbox"
                name="showServiceDate"
                checked={filters.showServiceDate}
                onChange={handleChange}
              />{" "}
              Show Service Date
            </label>
            <label>
              <input
                type="checkbox"
                name="showDeadlineDate"
                checked={filters.showDeadlineDate}
                onChange={handleChange}
              />{" "}
              Show Deadline Date
            </label>
            <label>
              <input
                type="checkbox"
                name="showStatusDate"
                checked={filters.showStatusDate}
                onChange={handleChange}
              />{" "}
              Show Status Date
            </label>
          </div>
        </div>

        <div className="past-booking">
          <label>
            <input
              type="checkbox"
              name="showPastBookings"
              checked={filters.showPastBookings}
              onChange={handleChange}
            />{" "}
            Show Past Bookings
          </label>
        </div>

        <hr className="divider" />

        <div className="middle-row">
          <div className="select-box">
            <label>Reservation Status</label>
            <select
              name="reservationStatus"
              value={filters.reservationStatus}
              onChange={handleChange}
            >
              <option value="">- Select -</option>
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
              <option>Flight</option>
              <option>Tour</option>
            </select>
          </div>

          <div className="input-box">
            <label>Leader Name</label>
            <input
              type="text"
              name="leaderName"
              value={filters.leaderName}
              onChange={handleChange}
              placeholder="Enter Leader Name Here"
            />
          </div>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="subType"
                value="subAgent"
                checked={filters.subType === "subAgent"}
                onChange={handleChange}
              />{" "}
              Sub Agent
            </label>
            <label>
              <input
                type="radio"
                name="subType"
                value="subUser"
                checked={filters.subType === "subUser"}
                onChange={handleChange}
              />{" "}
              Sub Users
            </label>
          </div>
        </div>

        {/* <div className="platform-section">
          <label>Platform</label>
          <div className="platform-options">
            {["Web", "Mobile", "Android", "IOS"].map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  name="platform"
                  value={p}
                  checked={filters.platform.includes(p)}
                  onChange={handleChange}
                />{" "}
                {p}
              </label>
            ))}
          </div>
        </div> */}

        <div className="buttons">
          <button className="search-btn" onClick={handleSearch}>
            SEARCH
          </button>
          <button className="reset-btn" onClick={handleReset}>
            RESET
          </button>
        </div>
      </div>

      <div className="results">
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Leader Name</th>
                <th>Status</th>
                <th>Service</th>
                <th>Platform</th>
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
                  <td>{r.platform}</td>
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
