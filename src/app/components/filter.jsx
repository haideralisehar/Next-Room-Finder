"use client";
import React, { useEffect, useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../results/ResultsPage.css";
import "../styling/filter.css";

export default function Filters({
  filters,
  setFilters,
  clearFilters,
  showMap,
  setShowMap,
}) {
  // Local state for smooth slider UI
  const [localRange, setLocalRange] = useState([0, 2000]);

  // Static max price (BHD only)
  const computedMax = useMemo(() => {
    const storedMax = Number(filters?.maxPrice || 0);
    return Math.max(storedMax, 2000);
  }, [filters?.maxPrice]);

  /* --------------------------------------------------
     Reset slider + related filter values
     -------------------------------------------------- */
  const resetSlider = () => {
    const fullRange = [0, computedMax];

    setLocalRange(fullRange);

    setFilters((prev) => ({
      ...prev,
      priceRange: fullRange,
      minPrice: 0,
      maxPrice: computedMax,
    }));
  };

  /* --------------------------------------------------
     Reset everything when max price changes
     -------------------------------------------------- */
  useEffect(() => {
    const fullRange = [0, computedMax];

    setLocalRange(fullRange);

    setFilters((prev) => ({
      ...prev,
      title: "",
      rating: "",
      minPrice: 0,
      priceRange: fullRange,
      maxPrice: computedMax,
    }));
  }, [computedMax, setFilters]);

  return (
    <aside className="filters">
      <p style={{ fontWeight: "bold", padding: "10px 0" }}>
        <span style={{ color: "black" }}>ᯤ</span> Filters
      </p>

      {/* Map Button */}
      <div
        className="map-loc"
        style={{
          position: "relative",
          width: "100%",
          height: "120px",
          backgroundColor: "#f7f7f7",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #eaeaea",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(75, 160, 203, 0.24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
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

      {/* Clear Filters */}
      <button
        className="clear-btn-clear"
        onClick={() => {
          clearFilters();   // existing logic
          resetSlider();    // 🔥 explicit slider reset
        }}
      >
        Clear Filters
      </button>

      {/* HOTEL NAME */}
      <div className="filter-group">
        <p>Hotel Name</p>
        <input
          style={{
            border: "1px solid silver",
            fontSize: "14px",
            padding: "6px 10px",
            borderRadius: "4px",
            width: "100%",
          }}
          type="text"
          placeholder="Search by name..."
          value={filters?.title || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      {/* RATING */}
      <div className="filter-group">
        <p>Guest Rating</p>
        {["4+", "3+", "2+", "1+"].map((rate) => (
          <label key={rate} style={{ display: "block", cursor: "pointer" }}>
            <input
              type="radio"
              name="rating"
              value={rate}
              checked={filters?.rating === rate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, rating: e.target.value }))
              }
            />
            {rate}
          </label>
        ))}
      </div>

      {/* PRICE RANGE */}
      <div className="filter-group">
        <p>Price Range (BHD)</p>

        <Slider
          range
          min={0}
          max={computedMax}
          value={localRange}
          onChange={(value) => {
            setLocalRange(value);
            setFilters((prev) => ({
              ...prev,
              priceRange: value,
            }));
          }}
          onChangeComplete={(value) => {
            setFilters((prev) => ({
              ...prev,
              priceRange: value,
            }));
          }}
        />

        <p>
          (BHD) {localRange[0]} – (BHD) {localRange[1]}
        </p>
      </div>
    </aside>
  );
}
