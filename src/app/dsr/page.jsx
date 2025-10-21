"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/DSRPage.css";
import Header from "../components/Header";

const fakeData = {
  customer: [
    { id: 1, agency: "Alpha Travel", status: "Paid", date: new Date("2025-10-01"), amount: 100, currency: "USD" },
    { id: 2, agency: "Beta Tours", status: "Unpaid", date: new Date("2025-10-03"), amount: 290, currency: "EUR" },
    { id: 3, agency: "Gamma Holidays", status: "Partially Paid", date: new Date("2025-10-08"), amount: 40, currency: "SAR" },
    { id: 4, agency: "Sky Blue", status: "Partially Paid", date: new Date("2025-10-08"), amount: 140, currency: "BHD" },
    { id: 5, agency: "Sun Shine", status: "Paid", date: new Date("2025-10-08"), amount: 90, currency: "USD" },
    { id: 6, agency: "Thread", status: "Unpaid", date: new Date("2025-07-08"), amount: 100, currency: "BHD" },
    { id: 7, agency: "Ocean View", status: "Paid", date: new Date("2025-07-18"), amount: 75, currency: "SAR" },
    { id: 8, agency: "Silver Line", status: "Unpaid", date: new Date("2025-07-21"), amount: 300, currency: "USD" },
    { id: 9, agency: "Golden Wings", status: "Paid", date: new Date("2025-09-25"), amount: 180, currency: "EUR" },
    { id: 10, agency: "Blue Horizon", status: "Partially Paid", date: new Date("2025-09-30"), amount: 220, currency: "USD" },
    { id: 11, agency: "Dream Escape", status: "Unpaid", date: new Date("2025-10-04"), amount: 310, currency: "SAR" },
    { id: 12, agency: "Royal Routes", status: "Paid", date: new Date("2025-09-20"), amount: 150, currency: "BHD" },
    { id: 13, agency: "Fly High", status: "Paid", date: new Date("2025-08-29"), amount: 95, currency: "USD" },
    { id: 14, agency: "Happy Journey", status: "Partially Paid", date: new Date("2025-09-05"), amount: 200, currency: "EUR" },
    { id: 15, agency: "Travel Bee", status: "Unpaid", date: new Date("2025-10-11"), amount: 260, currency: "SAR" },
    { id: 16, agency: "Elite Vacations", status: "Paid", date: new Date("2025-09-28"), amount: 180, currency: "BHD" },
    { id: 17, agency: "Majestic Tours", status: "Unpaid", date: new Date("2025-10-09"), amount: 340, currency: "USD" },
    { id: 18, agency: "Blue Lagoon", status: "Partially Paid", date: new Date("2025-09-15"), amount: 120, currency: "SAR" },
    { id: 19, agency: "Blue Horizon", status: "Paid", date: new Date("2025-10-09"), amount: 30, currency: "BHD" },
    { id: 20, agency: "Lagoon John", status: "Paid", date: new Date("2025-09-15"), amount: 10, currency: "USD" },
  ],
};


export default function DSRPage() {
  const [filters, setFilters] = useState({
    agency: "",
    status: "",
    currency: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Trigger search on Enter key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filters, startDate, endDate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    let data = fakeData.customer;

    data = data.filter((item) => {
      if (filters.agency && filters.agency !== "All" && item.agency !== filters.agency) return false;
      if (filters.status && filters.status !== "All" && item.status !== filters.status) return false;
      if (filters.currency && filters.currency !== "All" && item.currency !== filters.currency) return false;
      if (startDate && endDate) {
        if (item.date < startDate || item.date > endDate) return false;
      }
      return true;
    });

    setFilteredData(data);
    setCurrentPage(1); // reset pagination to page 1
  };

  const handleReset = () => {
    setFilters({
      agency: "",
      status: "",
      currency: "",
    });
    setDateRange([null, null]);
    setFilteredData([]);
    setCurrentPage(1);
    document.querySelectorAll("select").forEach((select) => (select.value = ""));
  };

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  

  // ✅ Pagination logic with smooth scroll to "rprt-rslt"
const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    scrollToResultsTop();
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    scrollToResultsTop();
  };

// ✅ Smooth scroll to ".rprt-rslt"
const scrollToResultsTop = () => {
  const resultElement = document.querySelector(".action-buttons");
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
      <div className="rprt">Daily Sale Reports (DSR)</div>

      <div className="dsr-container">
        <div className="filter-section">
          <div className="filter-item">
            <label>Agency</label>
            <select name="agency" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Alpha Travel">Alpha Travel</option>
              <option value="Beta Tours">Beta Tours</option>
              <option value="Gamma Holidays">Gamma Holidays</option>
              <option value="Sky Blue">Sky Blue</option>
              <option value="Sun Shine">Sun Shine</option>
              <option value="Thread">Thread</option>
            </select>
          </div>

          <div className="filter-item">
            {filters.status === "" ? (
              <label>Status - All</label>
            ) : (
              <label>Status - {filters.status}</label>
            )}
            <select name="status" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Booking Date</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select range"
              className="date-picker"
            />
          </div>

          <div className="filter-item">
            <label>Currency</label>
            <select name="currency" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SAR">SAR</option>
              <option value="BHD">BHD</option>
            </select>
          </div>

          <div className="action-buttons">
            <button onClick={handleSearch} className="search-btn">SEARCH</button>
            <button onClick={handleReset} className="reset-btn">RESET</button>
          </div>
        </div>

        {filteredData.length > 0 && (
          <div className="rprt-rslt">{filteredData.length} - Result(s) Found
          <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
          </div>
        )}

        <div className="result-section">
          {currentItems.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    {Object.keys(currentItems[0]).map((key) => (
                      <th key={key}>{key.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      {Object.keys(item).map((key) => (
                        <td key={key}>
                          {item[key] instanceof Date ? item[key].toLocaleDateString() : item[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={goToPrevPage} disabled={currentPage === 1}>
                    ◀ Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next ▶
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-records">No records found.</p>
          )}
        </div>
      </div>
    </>
  );
}
