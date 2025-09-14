"use client";
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../results/ResultsPage.css"; // if styles are defined there
import "../styling/filter.css";
import { useCurrency } from "../Context/CurrencyContext";

export default function Filters({
  filters,
  setFilters,
  clearFilters,
  showMap,
  setShowMap,
}) {
  const { currency, convertPrice } = useCurrency();
  return (
    <aside className="filters">
      <p style={{ fontWeight: "bold", textAlign: "left", padding: "10px 0px" }}>
        Filters
      </p>
      <div
        className="map-loc"
        style={{
          position: "relative",
          width: "100%",
          height: "120px",
          backgroundColor: "#f7f7f7ff",
          margin: "0 0 20px 0",
          borderRadius: "8px",
          border: "1px solid #eaeaea",
          overflow: "hidden",
        }}
      >
        {/* Overlay layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(75, 160, 203, 0.24)", // semi-transparent
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          {/* Centered button */}
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bffff",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {showMap ? "Go To Map" : "View List"}
          </button>
        </div>
      </div>

      <button className="clear-btn" onClick={clearFilters}>
        Clear Filters
      </button>

      {/* Title Search */}
      <div className="filter-group">
        <p>Hotel Name</p>

        <input
          style={{
            border: "1px solid silver",
            fontSize: "14px",
            padding: "6px",
            borderRadius: "4px",
            width: "100%",
          }}
          id="hotelName"
          type="text"
          placeholder="Search by name..."
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
      </div>

      {/* Rating Filter */}
      <div className="filter-group">
        <p>Guest Rating</p>
        {["4+", "3+", "2+", "1+"].map((rate) => (
          <label key={rate}>
            <input
              type="radio"
              name="rating"
              value={rate}
              checked={filters.rating === rate}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
            />
            {rate}
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <p>Price Range ({currency})</p>
        <Slider
          range
          min={0}
          max={1000}
          defaultValue={filters.priceRange}
          value={filters.priceRange}
          onChange={(value) => setFilters({ ...filters, priceRange: value })}
        />
        <p>
          ({currency}){filters.priceRange[0]} – ({currency}){filters.priceRange[1]}
        </p>
      </div>
    </aside>
  );
}
