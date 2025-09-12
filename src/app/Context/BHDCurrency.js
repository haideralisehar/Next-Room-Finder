// context/CurrencyContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Conversion rates (base: BHD)
const conversionRates = {
  BHD: 1,
  USD: 2.65,
  EUR: 2.45,
  SAR: 9.95,
};

const BhdCurrencyContext = createContext();

export function BhdCurrencyProvider({ children }) {
  const [Bhdcurrency, setBhdCurrency] = useState("BHD"); // ✅ Default: BHD

  // ✅ Load currency from localStorage when app starts
  useEffect(() => {
    const savedCurrency = localStorage.getItem("BhdselectedCurrency");
    if (savedCurrency) {
      setBhdCurrency(savedCurrency);
    }
  }, []);

  // ✅ Save currency to localStorage whenever it changes
  useEffect(() => {
    if (Bhdcurrency) {
      localStorage.setItem("BhdselectedCurrency", Bhdcurrency);
    }
  }, [Bhdcurrency]);

  const convertPrice = (priceInBhd) => {
    return (priceInBhd * conversionRates[Bhdcurrency]).toFixed(2);
  };

  return (
    <BhdCurrencyContext.Provider
      value={{ Bhdcurrency, setBhdCurrency, convertPrice }}
    >
      {children}
    </BhdCurrencyContext.Provider>
  );
}
``;

// Custom hook for easier usage
export const useBhdCurrency = () => useContext(BhdCurrencyContext);
