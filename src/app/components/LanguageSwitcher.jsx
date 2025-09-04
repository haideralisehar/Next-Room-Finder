"use client";
import { useEffect, useState } from "react";

const DEFAULT_PAGE_LANG = "en";

export default function LanguageSwitcher() {
   const [lang, setLang] = useState(DEFAULT_PAGE_LANG);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("preferred_lang");
    if (saved) setLang(saved);
  }, []);

  const toggleLanguage = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("preferred_lang", next);

    // Set Google Translate cookie and reload page to apply instantly
    document.cookie = `googtrans=/en/${next}; path=/`;
    window.location.reload();
  };

  return (
     <button
      className="notranslate"
      translate="no"
      onClick={toggleLanguage}
      style={{
        padding: "8px 16px",
        color: "black",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      <p style={{color:"white", cursor:"pointer"}}>{lang === "en" ? "Arabic" : "Eng"}</p>
    </button>
  );
}