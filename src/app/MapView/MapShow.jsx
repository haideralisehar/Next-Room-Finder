"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { IoLocationOutline } from "react-icons/io5";
import { useCurrency } from "../Context/CurrencyContext";
import Link from "next/link";

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
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// ✅ Custom DivIcon with price
const createPriceIcon = (price, currency) =>
  L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background:#007bff;
      font-family:Jost;
      color:#fff;
      padding:5px 3px;
      border-radius: 12px;
      font-size: 6px;
      font-weight:600;
      width:50px;
      
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    ">${price} ${currency}</div>`,
    iconSize: [40, 20],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

export default function MapWithPrices({
  hotels = [],
  from,
  to,
  nights,
  rooms,
}) {
  const [showMap, setShowMap] = useState(true);
  const { currency, convertPrice } = useCurrency();

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        height: "100%",
        borderRadius: "6px",
        margin: "0px auto",
      }}
    >
      {showMap && (
        <div style={{ borderRadius: "6px", height: "100%" }}>
          <MapContainer
            center={[26.2285, 50.586]}
            zoom={5}
            style={{ height: "90vh", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hotels.map((hotel) => (
              <Marker
                key={hotel.id}
                position={hotel.position}
                icon={createPriceIcon(convertPrice(hotel.price), currency)}
              >
                <Popup>
                  <div className="popup-card">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="popup-image"
                    />
                    <h4 className="popup-title">{hotel.name}</h4>
                    <div
                      className="m-xtx-set"
                      style={{ display: "flex", margin: "0px 0px 0px 6px" }}
                    >
                      <IoLocationOutline style={{ fontSize: "14px" }} />
                      <p className="location">{hotel.location}</p>
                    </div>
                    {/* <p className="popup-para">{hotel.location}</p> */}
                    <div
                      className="popup-footer"
                      style={{ padding: "3px 10px" }}
                    >
                      <p className="popup-price">
                        {convertPrice(hotel.price)} {currency}
                      </p>
                      <Link
                        key={hotel.id}
                        href={{
                          pathname: "/hotel-view",
                          query: {
                            id: hotel.id,
                            name: hotel.name,
                            location: hotel.location,
                            price: hotel.price,
                            image: hotel.image,
                            from: from,
                            to: to,
                            rooms: JSON.stringify(rooms),
                            count: rooms.length,
                            nights: nights,
                            rating: hotel.rating,
                            description: hotel.description,
                            facility: JSON.stringify(hotel.facilities),
                            roomImages: JSON.stringify(hotel.roomImages),
                            hotelRooms: JSON.stringify(hotel.rooms),
                            roomPhotos: JSON.stringify(hotel.roomImages),
                          },
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="popup-button">Book Now</button>
                      </Link>
                    </div>
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
