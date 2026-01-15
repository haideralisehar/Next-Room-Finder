"use client";
import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerBookingRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <BookingContext.Provider value={{ refreshKey, triggerBookingRefresh }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
