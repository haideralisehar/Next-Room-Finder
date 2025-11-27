"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar from "../components/RoomSearch";
import { hotelsData } from "../HotelDetails/hoteldata.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../results/ResultsPage.css";
import "../results/HotelsList.css";
import Link from "next/link";
import Filters from "../components/filter";
import MobFilter from "../components/MobFilter";
import { IoLocationOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import StarRating from "../components/rating";
import { useCurrency } from "../Context/CurrencyContext";
import dynamic from "next/dynamic";
import ImageViewer from "../components/ImageViewer";
import HotelTabs from "../components/tabs";

const MapWithPrices = dynamic(() => import("../MapView/MapShow"), {
  ssr: false,
});

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const { currency, convertPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [nights, setNights] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState("");
  const handlePopupToggle = () => setShowPopup(!showPopup);
  const [showMap, setShowMap] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Filters state (maxPrice will be set once results load)
  const [filters, setFilters] = useState({
    title: "",
    rating: "",
    minPrice: 0,
    maxPrice: 2000, // stored in CURRENT currency
    priceRange: [0, 2000],
  });

  const [sortOption, setSortOption] = useState("");

  // Helpful: turn convertPrice output into a plain number robustly
  const parseConvertedNumber = (val) => {
    if (val === null || val === undefined) return 0;
    // convertPrice may return a number or a formatted string like "1,234.56"
    const s = String(val);
    // remove all except digits, dot and minus
    const cleaned = s.replace(/[^0-9.\-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Load and merge incoming API data
  useEffect(() => {
    const stored = sessionStorage.getItem("hotelData");

    if (!stored) {
      console.error("No hotel data found in sessionStorage");
      setLoading(false);
      return;
    }

    const apiResponse = JSON.parse(stored);
    const hotels = apiResponse.hotelDetails?.data || [];
    const hotelList = apiResponse.prices?.Success?.PriceDetails?.HotelList || [];
    const hotelListMap = new Map(hotelList.map((h) => [h.HotelID, h]));
    const mergedHotels = hotels
      .filter((hotel) => hotelListMap.has(hotel.id))
      .map((hotel) => ({ ...hotel, priceInfo: hotelListMap.get(hotel.id) }));

    setTimeout(() => {
      const dest = searchParams.get("destination") || "";
      const f = searchParams.get("checkIn") || "";
      const t = searchParams.get("checkOut") || "";
      const d = searchParams.get("description");

      let r = [];
      try {
        r = searchParams.get("rooms")
          ? JSON.parse(decodeURIComponent(searchParams.get("rooms")))
          : [];
      } catch (e) {
        console.error("Invalid rooms data:", e);
      }

      setDestination(dest);
      setFrom(f);
      setTo(t);
      setNights(searchParams.get("nights") || "");
      setRooms(r);
      setDescription(d);

      setResults(mergedHotels);
      setLoading(false);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Recompute converted prices and maxPrice whenever results OR currency change
  useEffect(() => {
    if (!results || results.length === 0) {
      // if no results, keep defaults but ensure priceRange consistent
      setFilters((prev) => ({
        ...prev,
        maxPrice: prev.maxPrice || 2000,
        priceRange: Array.isArray(prev.priceRange) ? prev.priceRange : [0, prev.maxPrice || 2000],
      }));
      return;
    }

    // compute converted numeric price for each hotel
    const convertedPrices = results
      .map((h) => {
        const raw = Number(h?.priceInfo?.LowestPrice?.Value) || 0;
        const conv = parseConvertedNumber(convertPrice(raw)); // number in current currency
        return Number.isFinite(conv) && conv > 0 ? conv : 0;
      })
      .filter((p) => p > 0);

    const highest = convertedPrices.length ? Math.ceil(Math.max(...convertedPrices)) : 2000;

    setFilters((prev) => {
      const newMax = Math.max(highest, 1);
      const prevMin = Array.isArray(prev.priceRange) ? Number(prev.priceRange[0] || 0) : 0;
      const prevMax = Array.isArray(prev.priceRange) ? Number(prev.priceRange[1] || newMax) : newMax;

      const clampedMax = Math.min(prevMax, newMax);
      const clampedMin = Math.min(Math.max(prevMin, 0), clampedMax);

      // only update when necessary
      if (prev.maxPrice === newMax && prev.priceRange?.[0] === clampedMin && prev.priceRange?.[1] === clampedMax) {
        return prev;
      }

      return {
        ...prev,
        maxPrice: newMax,
        priceRange: [clampedMin, clampedMax],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, currency]);

  // Filter + sort results using converted prices
  const filteredResults = useMemo(() => {
    if (!results) return [];

    const applyConvertedPrice = (hotel) => {
      const raw = Number(hotel?.priceInfo?.LowestPrice?.Value) || 0;
      return parseConvertedNumber(convertPrice(raw));
    };

    let data = results.filter((hotel) => {
      const convPrice = applyConvertedPrice(hotel);

      // Title filter
      if (filters.title && !hotel?.name?.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      // Rating
      const r = Number(hotel?.starRating || 0);
      if (filters.rating) {
        if (filters.rating === "4+" && r < 4) return false;
        if (filters.rating === "3+" && r < 3) return false;
        if (filters.rating === "2+" && r < 2) return false;
        if (filters.rating === "1+" && r < 1) return false;
      }

      // Price range (compare converted prices)
      const [minP = 0, maxP = filters.maxPrice || 0] = filters.priceRange || [];
      if (convPrice < minP || convPrice > maxP) return false;

      return true;
    });

    // Sorting: use converted prices for price sorts
    if (sortOption) {
      const getConv = (h) => parseConvertedNumber(convertPrice(Number(h?.priceInfo?.LowestPrice?.Value || 0)));
      data = [...data].sort((a, b) => {
        const pa = getConv(a);
        const pb = getConv(b);
        switch (sortOption) {
          case "price-low":
            return pa - pb;
          case "price-high":
            return pb - pa;
          case "az":
            return (a.name || "").localeCompare(b.name || "");
          case "za":
            return (b.name || "").localeCompare(a.name || "");
          default:
            return 0;
        }
      });
    }

    return data;
  }, [results, filters, sortOption, currency]);

  function clearFilters() {
    setFilters((prev) => ({
      ...prev,
      title: "",
      rating: "",
      priceRange: [0, prev.maxPrice || 2000],
    }));
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Please Wait...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HotelSearchBar
        initialData={{
          destination: destination,
          checkIn: from,
          checkOut: to,
          rooms: rooms.length > 0 ? rooms : [{ adults: 1, children: 0, childrenAges: [] }],
        }}
      />

      <div className="map-mobile">
        <div
          className="map-loc"
          style={{
            position: "relative",
            width: "100%",
            height: "130px",
            backgroundColor: "#f7f7f7ff",
            margin: "0 0 20px 0",
            borderRadius: "8px",
            border: "1px solid #eaeaea",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(44, 161, 220, 0.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => setShowMap(!showMap)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bffff",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showMap ? "Go To Map" : "View List"}
            </button>
          </div>
        </div>
      </div>

      <div className="nf-pro">
        <p className="desti-count">{filteredResults.length} properties in {destination}</p>

        <div className="set-fil" style={{ display: "flex", gap: "7px", marginTop: "0px" }}>
          <div
            className="btn-filter"
            style={{
              padding: "7px 12px 6px 12px",
              borderRadius: "5px",
              background: " #0071c2",
              color: "white",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }} onClick={handlePopupToggle}>
              <FaFilter />{" "}
              <p style={{ fontSize: "14px", fontWeight: "normal" }}>Filter</p>
            </div>
          </div>

          <select className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="az">Alphabetical (A → Z)</option>
            <option value="za">Alphabetical (Z → A)</option>
          </select>
        </div>
      </div>

      <div className="results-container">
        {destination === "" ? (
          <main className="hotel-results">
            <div className="hotel-list">
              <p style={{ fontSize: "16px", color: "gray", textAlign: "center", padding: "20px" }}>
                Try searching or find other hotels
              </p>
            </div>
          </main>
        ) : (
          <>
            <Filters
              setShowMap={setShowMap}
              showMap={showMap}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />

            {showMap && (
              <main className="hotel-results">
                <div className="hotel-list">
                  {filteredResults.length === 0 ? (
                    <p style={{ fontSize: "16px", color: "gray", textAlign: "center", padding: "20px" }}>
                      No properties found for "{destination}". Try adjusting filters or search for another place.
                    </p>
                  ) : (
                    <div className="hotel-container">
                      {filteredResults.map((hotel) => {
                        const raw = Number(hotel?.priceInfo?.LowestPrice?.Value) || 0;
                        const convPrice = parseFloat(String(convertPrice(raw)).replace(/[^0-9.\-]/g, "")) || 0;
                        return (
                          <div className="hotel-card" key={hotel.id}>
                            <div className="hotel-img-wrapper">
                              <img
                                src={hotel?.images?.find((img) => img?.url)?.url || "/no-image.jpg"}
                                alt={hotel.name}
                                className="hotel-img"
                                onError={(e) => {
                                  e.target.src = "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                                }}
                              />
                            </div>

                            <div className="hotel-details">
                              <div className="hotel-header">
                                <StarRating rating={hotel.starRating || 0} />
                                <h3>{hotel.name}</h3>
                              </div>

                              <div className="m-xtx-set" style={{ display: "flex" }}>
                                <IoLocationOutline />
                                <p className="location">{hotel.location?.address}</p>
                              </div>

                              <span>
                                <p
                                  style={{
                                    color: "#1c8bd0ff",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontSize: "13px",
                                    paddingLeft: "3px",
                                  }}
                                  onClick={() => setSelectedHotel(hotel)}
                                >
                                  See More
                                </p>
                              </span>

                              <div className="price-info top-right">
                                <p className="price">
                                  {Number.isFinite(convPrice) ? convPrice : 0} {currency}
                                </p>
                                <p className="price-sub">{(hotel.rooms || []).length} room(s)</p>

                                <button
                                  className="bok-btn"
                                  style={{
                                    fontSize: "14px",
                                    backgroundColor: "#f74a06ff",
                                    padding: "3px 14px",
                                    color: "white",
                                    borderRadius: "20px",
                                    marginTop: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {selectedHotel && (
                        <div className="popup-overlay-room">
                          <div className="popup-content-room">
                            <button className="popup-close" onClick={() => setSelectedHotel(null)}>✕</button>

                            <div className="RatingPlusTitle">
                              <h1 className="hotel-title" style={{ padding: "0px 12px 0px 20px" }}>
                                {selectedHotel.name}
                              </h1>
                              <div className="StartManage">
                                <StarRating rating={selectedHotel.starRating} />
                              </div>
                            </div>

                            <div className="tit-mng" style={{ padding: "0px 12px 0px 20px" }}>
                              <IoLocationOutline />
                              <p>{selectedHotel.location?.address}</p>
                            </div>

                            <ImageViewer images={selectedHotel.images.map((img) => img.url)} location={[
                              selectedHotel.location?.coordinate,
                              selectedHotel.location?.latitude,
                            ]} />

                            <HotelTabs description={selectedHotel?.description} facility={selectedHotel.facilities} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </main>
            )}

            {!showMap && (
              <div className="map-con">
                <MapWithPrices hotels={filteredResults} />
              </div>
            )}
          </>
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <MobFilter
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                handlePopupToggle={handlePopupToggle}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
