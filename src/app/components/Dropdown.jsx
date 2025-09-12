"use client";
import React, { useState, useRef, useEffect } from "react";
import "../styling/Dropdown.css";
import { useCurrency } from "../Context/CurrencyContext";

const DropdownAlt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrency(); // ✅ from context
  const options = ["USD", "EUR", "BHD", "SAR"];
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const [lange, setLange] = useState("");

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("preferred_lang");
    if (saved) setLange(saved);
    
    
  }, []);

  const handleSelect = (option) => {
    setCurrency(option); // ✅ context + auto save in localStorage
    setIsOpen(false);
    if(lange ==="ar"){
      window.location.reload();
    }
    
    
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div translate="no" className="dropdown-alt" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {currency} <span className="arrow">&#9662;</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options
            .filter((option) => option !== currency) // ✅ hide currently selected one
            .map((option) => (
              <div
                key={option}
                className="dropdown-option"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownAlt;
