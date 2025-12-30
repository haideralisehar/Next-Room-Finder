"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { IoLocationOutline } from "react-icons/io5";
import { useCurrency } from "../Context/CurrencyContext";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedHotel, setApiResults } from "../redux/hotelSlice";

import { setDictionaryTypes } from "../redux/searchSlice";
import Image from "next/image";

// Dynamically import Map components
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

// Custom price marker
const createPriceIcon = (price, currency) =>
  L.divIcon({
    className: "custom-price-marker",
    html: `<div style="
      background:#007bff;
      font-family:Jost;
      color:#fff;
      padding:5px 3px;
      border-radius: 50px;
      font-size: 12px;
      font-weight:600;
      width:100px;
      height:28px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
    ">${price} ${currency}</div>`,
    iconSize: [40, 20],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

export default function MapWithPrices({ hotels = [], Discount, Markup, roomCount }) {
  const [showMap, setShowMap] = useState(true);
  const { currency, convertPrice } = useCurrency();
   const dispatch = useDispatch();
  
     const [loadingfetch, setLoadingfetch] = useState(false); // loader

  // ✅ Compute center for ANY country — based on all hotel coordinates
  const center =
    hotels.length > 0
      ? [
          hotels.reduce(
            (sum, h) => sum + h.location.coordinate.latitude,
            0
          ) / hotels.length,
          hotels.reduce(
            (sum, h) => sum + h.location.coordinate.longitude,
            0
          ) / hotels.length,
        ]
      : [20, 0]; // 🌍 fallback (Africa-centered world view)

  return (

    <>
    {loadingfetch && (
            <div className="loading-container">
              <div className="box">
                <Image
                  className="circular-left-right"
                  src="/loading_ico.png"
                  alt="Loading"
                  width={200}
                  height={200}
                />
                <p style={{ fontSize: "13px" }}>Please Wait...</p>
              </div>
            </div>
          )}
   
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
            center={center}
            zoom={4}
            style={{ height: "90vh", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hotels.map((hotel) => (
              <Marker
                key={hotel.id}
                position={[
                  hotel.location.coordinate.latitude,
                  hotel.location.coordinate.longitude,
                ]}
                icon={createPriceIcon(
                  hotel.priceInfo?.LowestPrice?.Value*roomCount.length, "BHD"
                  // currency
                )}
              >
                <Popup>
                  <div className="popup-card">
                    <img
                      src={
                        hotel?.images?.find((img) => img?.url)?.url ||
                        "/no-image.jpg"
                      }
                      alt={hotel.name}
                      className="popup-image"
                      onError={(e) => {
                        e.target.src =
                          "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                      }}
                    />

                    <h4 className="popup-title">{hotel.name}</h4>

                    <div
                      className="m-xtx-set"
                      style={{ display: "flex", margin: "0px 0px 0px 6px" }}
                    >
                      <IoLocationOutline style={{ fontSize: "14px" }} />
                      <p className="location">{hotel.location.address}</p>
                    </div>

                    <div
                      className="popup-footer"
                      style={{ padding: "3px 10px" }}
                    >
                      <p className="popup-price">
                        {/* {convertPrice(hotel.priceInfo?.LowestPrice?.Value)}{" "} */}
                        {/* {currency} */}
                        {hotel.priceInfo?.LowestPrice?.Value * roomCount.length} {"BHD"}
                      </p>

                      <button className="popup-button"
                       onClick={async () => {
                                                          try {
                                                            setLoadingfetch(true);
                      
                                                            // 1️⃣ Call API
                                                            const res = await fetch("/api/all_types");
                                                            const data = await res.json();
                      
                                                            if (!data.success) {
                                                              console.error("API Error:", data.error);
                                                              setLoadingfetch(false);
                                                              return;
                                                            }
                      
                                                            const modiData = {
                                                              ...hotel,
                                                              room_count: roomCount,
                                                              Discount,
                                                              Markup,
                                                            };
                      
                                                            // 2️⃣ Save selected hotel in Redux
                                                            dispatch(setSelectedHotel(modiData));
                      
                                                            // 3️⃣ Save dictionary / types / API results
                                                            dispatch(setDictionaryTypes(data.data));
                                                            dispatch(setApiResults(data.data));
                      
                                                            setLoadingfetch(false);
                      
                                                            // 4️⃣ Redirect to hotel-view page
                                                            // router.push(`/hotel-view?hotelId=${hotel.id}`);
                                                            window.open(
                                                              `/hotel-view?hotelId=${hotel.id}`,
                                                              "_blank"
                                                            );
                                                          } catch (error) {
                                                            console.error("Failed to fetch:", error);
                                                            setLoadingfetch(false);
                                                          }
                                                        }}
                      
                      >Book Now</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
     </>
  );
}
