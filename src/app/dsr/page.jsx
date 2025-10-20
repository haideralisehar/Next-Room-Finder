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
  };

  const handleReset = () => {
    setFilters({
      agency: "",
      status: "",
      currency: "",
    });
    setDateRange([null, null]);
    setFilteredData([]);
    document.querySelectorAll("select").forEach((select) => (select.value = ""));
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
            </select>
          </div>

          <div className="action-buttons">
            <button onClick={handleSearch} className="search-btn">SEARCH</button>
            <button onClick={handleReset} className="reset-btn">RESET</button>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="rprt-rslt">{filteredData.length} - Result(s) Found</div>
        ) : (
          ""
        )}

        <div className="result-section">
          {filteredData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(filteredData[0]).map((key) => (
                    <th key={key}>{key.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
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
          ) : (
            <p className="no-records">No records found.</p>
          )}
        </div>
      </div>
    </>
  );
}
