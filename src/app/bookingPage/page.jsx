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
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const dummyBookings = [
  { id: "B001", leader: "John Smith", status: "Confirmed", service: "Hotel", date: "2025-10-10" },
  { id: "B002", leader: "Alice Johnson", status: "Pending", service: "Hotel", date: "2025-09-28" },
  { id: "B003", leader: "David Lee", status: "Cancelled", service: "Hotel", date: "2025-08-10" },
  { id: "B004", leader: "Lee", status: "Confirmed", service: "Hotel", date: "2025-08-10" },
  { id: "B005", leader: "King Sultan", status: "Pending", service: "Hotel", date: "2025-09-10" },
  { id: "B006", leader: "Line Stone", status: "Cancelled", service: "Hotel", date: "2025-08-10" },
  { id: "B007", leader: "Marry Joe", status: "Confirmed", service: "Hotel", date: "2025-09-15" },
  { id: "B008", leader: "Alex Ray", status: "Pending", service: "Hotel", date: "2025-09-05" },
  { id: "B009", leader: "Daniel Craig", status: "Confirmed", service: "Hotel", date: "2025-07-22" },
  { id: "B010", leader: "Sophia Turner", status: "Cancelled", service: "Hotel", date: "2025-08-18" },
  { id: "B011", leader: "Michael Brown", status: "Pending", service: "Hotel", date: "2025-09-29" },
  { id: "B012", leader: "Emma Watson", status: "Confirmed", service: "Hotel", date: "2025-10-02" },
  { id: "B013", leader: "Chris Evans", status: "Pending", service: "Hotel", date: "2025-10-04" },
  { id: "B014", leader: "Jennifer Lopez", status: "Cancelled", service: "Hotel", date: "2025-09-01" },
  { id: "B015", leader: "Robert Downey", status: "Confirmed", service: "Hotel", date: "2025-10-08" },
  { id: "B016", leader: "Scarlett White", status: "Pending", service: "Hotel", date: "2025-09-12" },
  { id: "B017", leader: "Tom Holland", status: "Cancelled", service: "Hotel", date: "2025-08-30" },
  { id: "B018", leader: "Will Smith", status: "Confirmed", service: "Hotel", date: "2025-10-06" },
  { id: "B019", leader: "Natalie Portman", status: "Pending", service: "Hotel", date: "2025-09-21" },
  { id: "B020", leader: "Dwayne Johnson", status: "Confirmed", service: "Hotel", date: "2025-10-12" },
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
    setCurrentPage(1); // Reset to first page after searching
  };

  const handleReset = () => {
    setFilters({
      bookingId: "",
      reservationStatus: "",
      serviceType: "All",
      leaderName: "",
    });
    setResults([]);
    setCurrentPage(1);
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

  // ✅ Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = results.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(results.length / recordsPerPage);

  
// ✅ Pagination logic with smooth scroll to "rprt-rslt"
const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
    scrollToResultsTop();
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
    scrollToResultsTop();
  }
};

// ✅ Smooth scroll to ".rprt-rslt"
const scrollToResultsTop = () => {
  const resultElement = document.querySelector(".buttons");
  if (resultElement) {
    resultElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};



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
                {/* <option>Flight</option> */}
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

       
          {results.length > 0 && (
          <div className="rprt-rslt">
            {results.length} - Result(s) Found

             <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
          </div>
        )}

          
      

        

        <div className="results">
          {results.length > 0 ? (
            <>
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
                  {currentRecords.map((r) => (
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

              {/* ✅ Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                   ◀ Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                   Next ▶
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-results">No bookings found.</p>
          )}
        </div>
      </div>
    </>
  );
}
