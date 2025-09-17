// context/CurrencyContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Conversion rates (base: BHD)
const conversionRates = {
  BHD: 1,
  USD: 2.65,
  EUR: 2.26,
  SAR: 9.94,
};

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("BHD"); // ✅ Default: BHD

  // ✅ Load currency from localStorage when app starts
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // ✅ Save currency to localStorage whenever it changes
  useEffect(() => {
    if (currency) {
      localStorage.setItem("selectedCurrency", currency);
    }
  }, [currency]);

  const convertPrice = (priceInBhd) => {
    return (priceInBhd * conversionRates[currency]).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook for easier usage
export const useCurrency = () => useContext(CurrencyContext);
