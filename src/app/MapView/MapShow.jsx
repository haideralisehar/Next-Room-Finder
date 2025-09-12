"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css"

// ✅ Dynamically import Map components (SSR disabled)
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

const sampleLocations = [
  {
    id: 1,
    name: "Manama",
    position: [26.2708, 50.6261],
    price: "0 BHD",
    image: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
  },
  {
    id: 2,
    name: "Muharraq",
    position: [16.2708, 50.6261],
    price: "65 BHD",
    image: "https://via.placeholder.com/200x120.png?text=Muharraq+Resort",
  },
  {
    id: 3,
    name: "Riffa",
    position: [26.1292, 50.555],
    price: "40 BHD",
    image: "https://via.placeholder.com/200x120.png?text=Riffa+Inn",
  },
];

// ✅ Custom DivIcon with price
const createPriceIcon = (price) =>
  L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background:#007bff;
      color:#fff;
      padding:4px 8px;
      border-radius: 12px;
      font-size: 7px;
      font-weight:600;
      white-space:nowrap;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    ">${price}</div>`,
    iconSize: [40, 20],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

export default function MapWithPrices() {
  const [showMap, setShowMap] = useState(true);

  return (
    <div style={{ textAlign: "center" , width:"100%", height:"100%", borderRadius:"6px", margin:"0px auto" }}>
      {/* Toggle Map */}
      {/* <button
        onClick={() => setShowMap(!showMap)}
        style={{
          padding: "10px 20px",
          fontSize: "10px",
          borderRadius: "8px",
          fontWeight:"normal",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
        }}
      >
        {showMap ? "Hide Map" : "Show Map of Bahrain"}
      </button> */}

      {showMap && (
        <div style={{ borderRadius:"6px", height:"100%" }}>
          <MapContainer
            center={[26.2285, 50.586]}
            zoom={11}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {sampleLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={loc.position}
                icon={createPriceIcon(loc.price)}
              >
                <Popup>
                  <div style={{  width:"250px" }}>
                    <img
                      src={loc.image}
                      alt={loc.name}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                    <p>The marque hotel with pleasent things that can looking beautiful and emergin.</p>
                    <h4>{loc.name}</h4>
                    <p style={{ fontWeight: "bold" }}>{loc.price}</p>
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontFamily:"Jost"
                      }}
                      onClick={() => alert(`Booking ${loc.name}...`)}
                    >
                      Book Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
