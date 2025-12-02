"use client";
import { createContext, useState, useEffect } from "react";

export const MarkupContext = createContext();

export function MarkupProvider({ children }) {
  const [markup, setMarkup] = useState([]);
  const [loadingfetche, setLoadingfetche] = useState(false);

  const fetchMarkup = async () => {
    try {
      setLoadingfetche(true);

      const res = await fetch("/api/markup");
      const data = await res.json();

      if (!data.success) {
        console.error("API Error:", data.error);
        setLoadingfetche(false);
        return;
      }

      console.log("Fetched:", data.data);

      // ⭐ Save to context state
      setMarkup(data.data);

      setLoadingfetche(false);
    } catch (error) {
      console.error("Failed to fetch:", error);
      setLoadingfetche(false);
    }
  };

  useEffect(() => {
    fetchMarkup();
  }, []);

  // Log updated context value
  useEffect(() => {
    console.log("Updated Markup State:", markup);
  }, [markup]);

  return (
    <MarkupContext.Provider value={{ markup, loadingfetche, fetchMarkup }}>
      {children}
    </MarkupContext.Provider>
  );
}
