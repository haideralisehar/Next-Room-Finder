"use client";
import { createContext, useContext, useState } from "react";

const HotelContext = createContext();

export function HotelProvider({ children }) {
  const [hotelData, setHotelData] = useState(null);

  return (
    <HotelContext.Provider value={{ hotelData, setHotelData }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotelContext() {
  return useContext(HotelContext);
}
