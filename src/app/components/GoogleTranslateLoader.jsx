"use client";
import { useEffect } from "react";

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return; // prevent duplicate

    const addScript = document.createElement("script");
    addScript.id = "google-translate-script";
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    // <div
    //   id="google_translate_element"
    //   style={{ display: "none" }} // keep Google’s default dropdown hidden
    // />

    <></>
  );
}
