"use client";
import { useState, useEffect } from "react";

export default function SmartImage({ images = [], alt, className }) {
  const [src, setSrc] = useState(null);
  const [index, setIndex] = useState(0);
  const fallback =
    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";

  // === PRELOAD IMAGE BEFORE SHOWING ===
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = reject;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadNextImage = async () => {
      if (index === null) {
        setSrc(fallback);
        return;
      }

      const url = images[index];

      try {
        // Try loading with slight delay (fixes CDN cold start)
        await new Promise((r) => setTimeout(r, 200));

        const loaded = await preloadImage(url);
        if (isMounted) setSrc(loaded);
      } catch {
        // Move to next image
        if (index < images.length - 1) {
          setIndex((prev) => prev + 1);
        } else {
          setIndex(null);
          setSrc(fallback);
        }
      }
    };

    loadNextImage();

    return () => {
      isMounted = false;
    };
  }, [index, images]);

  return <img src={src || fallback} alt={alt} className={className} />;
}
