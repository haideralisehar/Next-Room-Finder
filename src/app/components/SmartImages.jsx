"use client";
import { useState } from "react";

export default function SmartImage({ images = [], alt, className }) {
  const [index, setIndex] = useState(0);

  const handleError = () => {
    if (index < images.length - 1) {
      setIndex(index + 1);  // Try next image
    } else {
      setIndex(null);       // All failed → show fallback
    }
  };

  const src =
    index === null
      ? "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
      : images[index];

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
