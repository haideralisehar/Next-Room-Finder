"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

const HotelSearchContext = createContext(null);

export function HotelSearchProvider({ children }) {
  const [searchPayload, setSearchPayload] = useState(null);
  const [apiResults, setApiResults] = useState(null);

  // ⭐ UNIVERSAL SEARCH FUNCTION (usable anywhere)
  const performSearch = useCallback(async (payload) => {
    try {
      const res = await fetch("/api/hotelsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setApiResults(data);
      return data;
    } catch (error) {
      console.error("performSearch Error:", error);
      return null;
    }
  }, []);

  return (
    <HotelSearchContext.Provider
      value={{
        searchPayload,
        setSearchPayload,
        apiResults,
        setApiResults,
        performSearch,  // ⭐ now globally available
      }}
    >
      {children}
    </HotelSearchContext.Provider>
  );
}

export const useHotelSearch = () => useContext(HotelSearchContext);
