"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styling/CountrySelector.module.css";

export default function CountrySelector({ selectedCountry, onCountrySelect, formData={} }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState(formData.country || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const justSelectedRef = useRef(false); // 🧠 flag to prevent reopening after selection

  useEffect(() => {
    if (search.trim().length < 1) {
      setCountries([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    // 👇 Show suggestions immediately while fetching
    if (!justSelectedRef.current) {
      setShowSuggestions(true);
    }

    setLoading(true);
    setCountries([]);

    const fetchCountries = async () => {
      try {
        const res = await fetch(`/api/country?q=${search}`);
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchCountries, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSelect = (countryName) => {
    setSearch(countryName);
    setShowSuggestions(false);
    onCountrySelect(countryName);
    justSelectedRef.current = true;

    // Reset flag after short delay
    setTimeout(() => {
      justSelectedRef.current = false;
    }, 300);

    if (typeof handleChange === "function") {
      handleChange({
        target: { name: "country", value: countryName },
      });
    }
  };

  return (
    <div className={styles.inputGroup}>
      <label>Country *</label>

      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => {
          if (!justSelectedRef.current && search) setShowSuggestions(true);
        }}
        className={styles.searchInput}
        autoComplete="off"
      />

      {showSuggestions && (
        <ul className={styles.suggestionList}>
          {loading ? (
            <li className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
            </li>
          ) : countries.length > 0 ? (
            countries.map((country) => (
              <li
                key={country.id}
                onClick={() => handleSelect(country.name)}
                className={styles.suggestionItem}
              >
                {country.name}
              </li>
            ))
          ) : (
            <li className={styles.noResultsItem}>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
