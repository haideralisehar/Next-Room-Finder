"use client";
import React, {useState, useMemo, useEffect} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styling/MobFilter.css";

export default function MobFilter({ filters, setFilters, clearFilters, handlePopupToggle }) {
   // Local state for smooth slider UI
    const [localRange, setLocalRange] = useState([1, 2000]);
  
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
        minPrice: 1,
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
        minPrice: 1,
        priceRange: fullRange,
        maxPrice: computedMax,
      }));
    }, [computedMax, setFilters]);

     const clearD=() => {
          clearFilters();   // existing logic
          resetSlider();    // 🔥 explicit slider reset
        };
  return (
    <div className="mobile-main-filter">
      <h3>Filter</h3>

      {/* Hotel Name */}
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

      {/* Guest Rating */}
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

      {/* PRICE RANGE */}
      <div className="filter-group">
        <p>Price Range (BHD)</p>

        <Slider
          range
          min={1}
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

      {/* Buttons */}
      <div className="btn-appRe">
        <button className="resets-btn" onClick={clearD}>
          Reset
        </button>
        <button className="applys-btn" onClick={handlePopupToggle}>
          Apply
        </button>
      </div>
    </div>
  );
}
