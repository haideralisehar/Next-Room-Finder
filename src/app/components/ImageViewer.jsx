"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "../styling/ImageViewer.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearchPlus,
  FaSearchMinus,
  FaTimes,
} from "react-icons/fa";

// ✅ Dynamically import react-leaflet (SSR disabled)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const ImageViewer = ({ images, location }) => {

  console.log(location);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [L, setL] = useState(null); // hold Leaflet after client import
  const imageRef = useRef(null);

  useEffect(() => {
    // Load Leaflet only in the browser
    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icons
      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      leaflet.Marker.prototype.options.icon = DefaultIcon;

      setL(leaflet); // now available client-side
    })();
  }, []);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setZoom(1);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  };

  const zoomIn = () => setZoom((prev) => prev + 0.2);
  const zoomOut = () => setZoom((prev) => (prev > 0.4 ? prev - 0.2 : prev));

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (imageRef.current?.requestFullscreen) {
        imageRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // ✅ Ensure location is always an array
  const position = location
    ? Array.isArray(location)
      ? location
      : [location.lat, location.lng]
    : [24.7136, 46.6753]; // fallback Riyadh

  return (
    <div className="viewer-container">
      {/* MAIN IMAGE */}
      <div className="main-image-section" ref={imageRef}>
        <img
          src={images[currentIndex]}
          alt="Main"
          style={{ transform: `scale(${zoom})` }}
          className="main-image"
        />
        <div className="controls">
          <button onClick={prevImage}>
            <FaArrowLeft />
          </button>
          <button onClick={nextImage}>
            <FaArrowRight />
          </button>
          <button onClick={zoomOut}>
            <FaSearchMinus />
          </button>
          <button onClick={zoomIn}>
            <FaSearchPlus />
          </button>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? "Exit ⛶" : "Full ⛶"}
          </button>
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="thumbnail-section">
        {images.map((img, index) => (
          <React.Fragment key={index}>
            {/* Empty div for Map */}
            {index === 0 && (
              <div
                className="empty-thumb"
                style={{
                  backgroundColor: "#ececec6e",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
                onClick={() => setShowMap(true)}
              >
                <img
                  style={{ margin: "20px auto", width: "50px", height: "50px" }}
                  src="https://cdn-icons-png.flaticon.com/128/1865/1865269.png"
                  alt="Map Icon"
                />
              </div>
            )}

            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${
                index === currentIndex ? "active-thumb" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            />
          </React.Fragment>
        ))}
      </div>

      {/* MAP OVERLAY */}
      {showMap && L && (
        <div className="map-overlay">
          <button className="close-btn" onClick={() => setShowMap(false)}>
            <FaTimes size={20} />
          </button>
          <MapContainer
            center={position}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position}>
              <Popup>
                <div className="pop-content">📍 Hotel Location</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
