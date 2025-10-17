"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/DSRPage.css";
import Header from "../components/Header";

const fakeData = {
  customer: [
    { id: 1, agency: "Alpha Travel", list: "Paid", date: new Date("2025-10-01"), amount: 100, currency: "USD" },
    { id: 2, agency: "Beta Tours", list: "Unpaid", date: new Date("2025-10-03"), amount: 290, currency: "EUR" },
    { id: 3, agency: "Gamma Holidays", list: "Paid", date: new Date("2025-10-08"), amount: 40, currency: "SAR" },
  ],
  payments: [
    { id: 1, agency: "Alpha Travel", service: "Hotel", date: new Date("2025-10-01") },
    { id: 2, agency: "Beta Tours", service: "Hotel", date: new Date("2025-10-06") },
    { id: 3, agency: "Gamma Holidays", service: "Hotel", date: new Date("2025-10-10") },
  ],
  invoices: [
    { id: 1, agency: "Alpha Travel", bookingNo: "INV-101", service: "Hotel", bookingDate: new Date("2025-10-02"), serviceDate: new Date("2025-10-05") },
    { id: 2, agency: "Beta Tours", bookingNo: "INV-102", service: "Hotel", bookingDate: new Date("2025-10-03"), serviceDate: new Date("2025-10-08") },
    { id: 3, agency: "Gamma Holidays", bookingNo: "INV-103", service: "Hotel", bookingDate: new Date("2025-10-04"), serviceDate: new Date("2025-10-09") },
  ],
  vouchers: [
    { id: 1, agency: "Alpha Travel", bookingNo: "VCH-201", service: "Hotel", date: new Date("2025-10-01") },
    { id: 2, agency: "Beta Tours", bookingNo: "VCH-202", service: "Hotel", date: new Date("2025-10-06") },
    { id: 3, agency: "Gamma Holidays", bookingNo: "VCH-203", service: "Hotel", date: new Date("2025-10-10") },
  ],
};

export default function DSRPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [serviceDateRange, setServiceDateRange] = useState([null, null]);

  const [startDate, endDate] = dateRange;
  const [serviceStart, serviceEnd] = serviceDateRange;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    let data = fakeData[activeTab] || [];

    data = data.filter((item) => {
      if (filters.agency && filters.agency !== "All" && item.agency !== filters.agency) return false;
      if (filters.list && filters.list !== "All" && item.list !== filters.list) return false;
      if (filters.service && filters.service !== "All" && item.service !== filters.service) return false;
      if (filters.currency && filters.currency !== "All" && item.currency !== filters.currency) return false;
      if (filters.bookingNo && item.bookingNo && !item.bookingNo.toLowerCase().includes(filters.bookingNo.toLowerCase())) return false;

      // Booking Date Range
      if (startDate && endDate) {
        if (item.date && (item.date < startDate || item.date > endDate)) return false;
        if (item.bookingDate && (item.bookingDate < startDate || item.bookingDate > endDate)) return false;
      }

      // Service Date Range (Invoices)
      if (serviceStart && serviceEnd && item.serviceDate && (item.serviceDate < serviceStart || item.serviceDate > serviceEnd))
        return false;

      return true;
    });

    setFilteredData(data);
  };

  const renderFilters = () => {
    switch (activeTab) {
      case "customer":
        return (
          <>
            <div className="filter-item">
              <label>Agency</label>
              <select name="agency" onChange={handleFilterChange}>
                <option>All</option>
                <option>Alpha Travel</option>
                <option>Beta Tours</option>
                <option>Gamma Holidays</option>
              </select>
            </div>

            <div className="filter-item">
              <label>List</label>
              <select name="list" onChange={handleFilterChange}>
                <option>All</option>
                <option>Paid</option>
                <option>Unpaid</option>
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
                <option>All</option>
                <option>USD</option>
                <option>EUR</option>
                <option>SAR</option>
              </select>
            </div>
          </>
        );

      case "payments":
        return (
          <>
            <div className="filter-item">
              <label>Agency</label>
              <select name="agency" onChange={handleFilterChange}>
                <option>All Agents</option>
                <option>Alpha Travel</option>
                <option>Beta Tours</option>
                <option>Gamma Holidays</option>
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
              <label>Services</label>
              <select name="service" onChange={handleFilterChange}>
                <option>All</option>
                <option>Hotel</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Results</label>
              <select name="results" onChange={handleFilterChange}>
                <option>All</option>
                <option>50</option>
                <option>100</option>
                <option>150</option>
                <option>200</option>
              </select>
            </div>
          </>
        );

      case "invoices":
        return (
          <>
            <div className="filter-item">
              <label>Agency</label>
              <select name="agency" onChange={handleFilterChange}>
                <option>All Agents</option>
                <option>Alpha Travel</option>
                <option>Beta Tours</option>
                <option>Gamma Holidays</option>
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
              <label>Service Date</label>
              <DatePicker
                selectsRange
                startDate={serviceStart}
                endDate={serviceEnd}
                onChange={(update) => setServiceDateRange(update)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select range"
                className="date-picker"
              />
            </div>

            <div className="filter-item">
              <label>Booking No</label>
              <input type="text" name="bookingNo" placeholder="Enter Booking number" onChange={handleFilterChange} />
            </div>

            <div className="filter-item">
              <label>Services</label>
              <select name="service" onChange={handleFilterChange}>
                <option>All</option>
                <option>Hotel</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Results</label>
              <select name="results" onChange={handleFilterChange}>
                <option>All</option>
                <option>50</option>
                <option>100</option>
                <option>150</option>
                <option>200</option>
              </select>
            </div>
          </>
        );

      case "vouchers":
        return (
          <>
            <div className="filter-item">
              <label>Agency</label>
              <select name="agency" onChange={handleFilterChange}>
                <option>All Agents</option>
                <option>Alpha Travel</option>
                <option>Beta Tours</option>
                <option>Gamma Holidays</option>
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
              <label>Booking No</label>
              <input type="text" name="bookingNo" placeholder="Enter Booking number" onChange={handleFilterChange} />
            </div>

            <div className="filter-item">
              <label>Services</label>
              <select name="service" onChange={handleFilterChange}>
                <option>All</option>
                <option>Hotel</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Results</label>
              <select name="results" onChange={handleFilterChange}>
                <option>All</option>
                <option>50</option>
                <option>100</option>
                <option>150</option>
                <option>200</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="rprt">My Reports</div>
      <div className="dsr-container">
        <div className="tab-header">
          {["customer", "payments", "invoices", "vouchers"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => {
                setActiveTab(tab);
                setFilters({});
                setFilteredData([]);
              }}
            >
              {tab === "customer"
                ? "Customer Statement"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="filter-section">
          {renderFilters()}

          <div className="action-buttons">
            <button onClick={handleSearch} className="search-btn">SEARCH</button>
            <button
              onClick={() => {
                setFilters({});
                setDateRange([null, null]);
                setServiceDateRange([null, null]);
                setFilteredData([]);
              }}
              className="reset-btn"
            >
              RESET
            </button>
          </div>
        </div>

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
