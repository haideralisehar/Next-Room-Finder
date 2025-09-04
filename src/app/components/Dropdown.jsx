"use client"
import React, { useState, useRef, useEffect } from "react";
import "../styling/Dropdown.css";

const DropdownAlt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("USD");
  const options = ["USD", "EUR", "BHD"];
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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
    <div className="dropdown-alt" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {selected} <span className="arrow">&#9662;</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
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
