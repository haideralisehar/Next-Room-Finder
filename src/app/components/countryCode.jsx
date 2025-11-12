"use client";
import React, { useState, useMemo } from "react";
import * as countryCodes from "country-codes-list";

import "../styling/countryCode.css"; // optional styling

const CountryCodeSelector = ({ onSelect }) => {
 const allCountries = useMemo(() => countryCodes.all(), []);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter based on search input
  const filteredCountries = allCountries.filter((country) =>
    country.countryNameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(selectedCountry);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    onSelect && onSelect(country); // Send selected value to parent if needed
  };

  return (
    <div className="country-selector-container">
      <div
        className="selector-display"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCountry ? (
          <span>
             +{selectedCountry.countryCallingCode}
          </span>
        ) : (
          <span>Select a country...</span>
        )}
        <span className="dropdown-icon">▼</span>
      </div>

      {showDropdown && (
        <div className="dropdown-menu">
          <input
            type="text"
            placeholder="Search country..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="dropdown-list">
            {filteredCountries.map((country, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(country)}
              >
                <span>{country.countryNameEn}</span>
                <span className="code">{country.countryCallingCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;
