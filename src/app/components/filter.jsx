"use client";
import React, { useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../results/ResultsPage.css";
import "../styling/filter.css";
import { useCurrency } from "../Context/CurrencyContext";

export default function Filters({
  filters,
  setFilters,
  clearFilters,
  showMap,
  setShowMap,
}) {
  const { currency } = useCurrency();

  const getMaxPrice = (cur) => {
    if (!cur) return 2000;
    const c = cur.toString().toUpperCase();
    if (c === "SAR") return 50000;
    // BHD, USD, EUR and others use 2000
    return 2000;
  };

  const maxPrice = getMaxPrice(currency);

  // When currency changes: clamp/reset the stored priceRange inside filters
  useEffect(() => {
    setFilters((prev) => {
      // ensure prev exists and has a priceRange array
      const prevRange = Array.isArray(prev?.priceRange)
        ? prev.priceRange
        : [0, maxPrice];

      let [minVal, maxVal] = prevRange.map((v) => Number(v || 0));

      // clamp to new bounds
      if (minVal < 0) minVal = 0;
      if (minVal > maxPrice) minVal = 0;
      if (maxVal > maxPrice) maxVal = maxPrice;
      if (maxVal < 0) maxVal = maxPrice;

      // if invalid (min > max) reset to full range
      if (minVal > maxVal) {
        minVal = 0;
        maxVal = maxPrice;
      }

      // Only update state if range actually changed (avoids loops)
      const unchanged =
        prevRange.length === 2 &&
        Number(prevRange[0]) === minVal &&
        Number(prevRange[1]) === maxVal;

      if (unchanged) return prev;
      return { ...prev, priceRange: [minVal, maxVal] };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]); // run only when currency changes

  // Safe value fallback for slider (keeps it controlled)
  const sliderValue =
    Array.isArray(filters?.priceRange) && filters.priceRange.length === 2
      ? filters.priceRange.map((v) => {
          const n = Number(v);
          if (Number.isNaN(n)) return 0;
          // clamp in case parent didn't
          return Math.min(Math.max(n, 0), maxPrice);
        })
      : [0, maxPrice];

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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(75, 160, 203, 0.24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
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
          value={filters?.title || ""}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
      </div>

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

      <div className="filter-group">
        <p>Price Range ({currency})</p>

        {/* key forces remount when maxPrice (currency) changes — fixes rc-slider not updating max */}
        <Slider
          key={`price-slider-${currency}-${maxPrice}`}
          range
          min={0}
          max={maxPrice}
          value={sliderValue}
          onChange={(value) => {
            // value will be an array [min, max]
            setFilters((prev) => ({ ...prev, priceRange: value }));
          }}
        />

        <p>
          ({currency}){sliderValue[0]} – ({currency}){sliderValue[1]}
        </p>
      </div>
    </aside>
  );
}
