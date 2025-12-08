"use client";

import React, { createContext, useContext, useState } from "react";

const HotelContext = createContext();

export function HotelProvider({ children }) {
  const [apiResultsData, setApiResultsData] = useState(null);   // Price + room API result
  const [selectedHotelData, setSelectedHotelData] = useState(null); // Hotel user clicked

  return (
    <HotelContext.Provider
      value={{
        apiResultsData,
        setApiResultsData,
        selectedHotelData,
        setSelectedHotelData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

// Custom hook
export const useHotelData = () => useContext(HotelContext);
