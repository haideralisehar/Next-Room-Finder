"use client";
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../results/ResultsPage.css"; // if styles are defined there
import "../styling/filter.css"

export default function Filters({ filters, setFilters, clearFilters }) {
  return (
    <aside className="filters">
      <h3>Filters</h3>

      <button className="clear-btn" onClick={clearFilters}>
        Clear Filters
      </button>

      {/* Title Search */}
      <div className="filter-group">
        <label htmlFor="hotelName">
          <h3>Hotel Name</h3>
        </label>
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
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
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
        <p>Price Range ($)</p>
        <Slider
          range
          min={0}
          max={1000}
          defaultValue={filters.priceRange}
          value={filters.priceRange}
          onChange={(value) =>
            setFilters({ ...filters, priceRange: value })
          }
        />
        <p>
          ${filters.priceRange[0]} – ${filters.priceRange[1]}
        </p>
      </div>
    </aside>
  );
}
