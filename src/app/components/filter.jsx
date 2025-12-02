"use client";
import React, { useEffect, useMemo } from "react";
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

  // Stable currency fallback max
  const fallbackMax = useMemo(() => {
    if (!currency) return 2000;
    const c = currency.toUpperCase();
    return c === "SAR" ? 50000 : 2000;
  }, [currency]);

  // computedMax is derived from filters.maxPrice (already converted in ResultsContent) OR fallback
  const computedMax = useMemo(() => {
    const stored = Number(filters?.maxPrice || 0);
    return Math.max(stored, fallbackMax);
  }, [filters?.maxPrice, fallbackMax]);

  // Clamp priceRange when currency or computedMax changes
  useEffect(() => {
    setFilters((prev) => {
      const prevRange = Array.isArray(prev?.priceRange) ? prev.priceRange : [0, computedMax];
      let [minVal, maxVal] = prevRange.map((v) => Number.isFinite(Number(v)) ? Number(v) : 0);

      if (minVal < 0) minVal = 0;
      if (maxVal > computedMax) maxVal = computedMax;
      if (minVal > maxVal) {
        minVal = 0;
        maxVal = computedMax;
      }

      const unchanged =
        prevRange.length === 2 &&
        prevRange[0] === minVal &&
        prevRange[1] === maxVal &&
        prev.maxPrice === computedMax;

      if (unchanged) return prev;
      return { ...prev, priceRange: [minVal, maxVal], maxPrice: computedMax };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, computedMax]);

  const sliderValue = useMemo(() => {
    if (Array.isArray(filters?.priceRange) && filters.priceRange.length === 2) {
      return [Math.max(0, Math.min(filters.priceRange[0], computedMax)), Math.max(0, Math.min(filters.priceRange[1], computedMax))];
    }
    return [0, computedMax];
  }, [filters?.priceRange, computedMax]);

  return (
    <aside className="filters">
      <p style={{ fontWeight: "bold", textAlign: "left", padding: "10px 0px" }}><span style={{color:"black"}}>ᯤ</span> Filters</p>

      <div className="map-loc" style={{ position: "relative", width: "100%", height: "120px", backgroundColor: "#f7f7f7ff", margin: "0 0 20px 0", borderRadius: "8px", border: "1px solid #eaeaea", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(75, 160, 203, 0.24)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
          <button onClick={() => setShowMap(!showMap)} style={{ padding: "10px 20px", backgroundColor: "#007bffff", color: "#fff", border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: "bold" }}>
            {showMap ? "Go To Map" : "View List"}
          </button>
        </div>
      </div>

      <button className="clear-btn-clear" onClick={clearFilters}>Clear Filters</button>

      <div className="filter-group">
        <p>Hotel Name</p>
        <input
          style={{ border: "1px solid silver", fontSize: "14px", padding: "6px 10px", borderRadius: "4px", width: "100%" }}
          id="hotelName"
          type="text"
          placeholder="Search by name..."
          value={filters?.title || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="filter-group">
        <p>Guest Rating</p>
        {["4+", "3+", "2+", "1+"].map((rate) => (
          <label key={rate} style={{ display: "block", cursor: "pointer" }}>
            <input type="radio" name="rating" value={rate} checked={filters?.rating === rate} onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))} />
            {rate}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p>Price Range ({currency})</p>

        <Slider key={`price-slider-${currency}-${computedMax}`} range min={0} max={computedMax} value={sliderValue} onChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value, maxPrice: computedMax }))} />

        <p>({currency}){sliderValue[0]} – ({currency}){sliderValue[1]}</p>
      </div>
    </aside>
  );
}
