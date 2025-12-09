"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styling/CountrySelector.module.css";

export default function CountrySelector({ show_label=true,selectedCountry, onCountrySelect, formData = {} }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState(formData.country || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const justSelectedRef = useRef(false);

  useEffect(() => {
    if (search.trim().length < 1) {
      setCountries([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    if (!justSelectedRef.current) {
      setShowSuggestions(true);
    }

    setLoading(true);
    setCountries([]);

    const fetchCountries = async () => {
      try {
        const res = await fetch(`/api/country?q=${search}`);
        const data = await res.json();

        // API RETURNS: { id, name, countryCode }
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

  // SELECT a country
  const handleSelect = (country) => {
    setSearch(`${country.name}, ${country.countryCode}`);
    setShowSuggestions(false);

    // SEND {name, countryCode} to parent
    onCountrySelect({
      name: country.name,
      code: country.countryCode, // 🔥 CORRECT FIELD
    });

    justSelectedRef.current = true;
    setTimeout(() => {
      justSelectedRef.current = false;
    }, 300);
  };
  // const show_label = true;

  return (
    <div className={styles.inputGroup}>
      {
        show_label&&(
          <label>Country *</label>
        )
      }
      

      <input
        type="text"
        placeholder={show_label?"Search country...":"Where you want to go?"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => {
          if (!justSelectedRef.current && search) setShowSuggestions(true);
        }}
        className={styles.searchInputs}
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
                onClick={() => handleSelect(country, country.countryCode)}
                className={styles.suggestionItem}
              >
                {country.name} ({country.countryCode}) {/* 🔥 FIXED */}
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
