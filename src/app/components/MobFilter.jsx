"use client";
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styling/MobFilter.css"

export default function MobFilter({filters, setFilters, clearFilters, handlePopupToggle }) {
  return (
    <div className="mobile-main-filter">
        <h3>Filter</h3>

      <div className="filter-group">
        <label htmlFor="hotelName">
          <h4>Hotel Name</h4>
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

      <div className="btn-appRe">
        <button className="resets-btn" onClick={clearFilters}>Reset</button>
        <button className="applys-btn" onClick={handlePopupToggle}>Apply</button>

      </div>

      
      
    </div>
  )
}
