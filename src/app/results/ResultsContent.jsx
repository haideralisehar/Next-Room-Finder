// src/app/results/page (or wherever your ResultsContent file is located) — replace the top-level imports to redux version
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchBar from "../components/RoomSearch";
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
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedHotel, setApiResults } from "../redux/hotelSlice";

import { setDictionaryTypes } from "../redux/searchSlice";

const MapWithPrices = dynamic(() => import("../MapView/MapShow"), {
  ssr: false,
});

export default function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency, convertPrice } = useCurrency();
  const dispatch = useDispatch();

  // get apiResults from redux
  const apiResults = useSelector((s) => s.search.apiResults);
  console.log(apiResults);
  const loadingSearch = useSelector((s) => s.search.loading);

  const [loadingfetch, setLoadingfetch] = useState(false); // loader

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
  const [selectedHotelLocal, setSelectedHotelLocal] = useState(null);
  const [starRating, setstarRating] = useState("");
  const [selectedHotelData, setSelectedHotelData] = useState(null);

  // filters...
  const [filters, setFilters] = useState({
    title: "",
    rating: "",
    minPrice: 0,
    maxPrice: 2000,
    priceRange: [0, 2000],
  });

  function clearFilters() {
    setFilters((prev) => ({
      ...prev,
      title: "",
      rating: "",
      priceRange: [0, prev.maxPrice || 2000],
    }));
  }

  const [sortOption, setSortOption] = useState("price-low");

  const parseConvertedNumber = (val) => {
    if (val === null || val === undefined) return 0;
    const s = String(val);
    const cleaned = s.replace(/[^0-9.\-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    const loadData = () => {
      if (!apiResults) {
        console.log("No hotel data found in redux");
        setLoading(false);
        return;
      }

      const date_check_in =
        apiResults.prices?.Success?.PriceDetails?.CheckInDate || "";
      const date_check_out =
        apiResults.prices?.Success?.PriceDetails?.CheckOutDate || "";

      const hotels = apiResults.hotelDetails?.data || [];
      const hotelList =
        apiResults.prices?.Success?.PriceDetails?.HotelList || [];

      const room_count = apiResults?.room;

      const hotelListMap = new Map(hotelList.map((h) => [h.HotelID, h]));

      // ✅ Add check-in / check-out inside mergedHotels
      const mergedHotels = hotels
        .filter((hotel) => hotelListMap.has(hotel.id))
        .map((hotel) => ({
          ...hotel,
          priceInfo: hotelListMap.get(hotel.id),
          checkIn: date_check_in,
          checkOut: date_check_out,
          room_count: room_count,
        }));

      setTimeout(() => {
        const dest = searchParams.get("destination") || "";
        const f = searchParams.get("checkIn") || "";
        const t = searchParams.get("checkOut") || "";
        const d = searchParams.get("description");
        let s_Rating = searchParams.get("starRating") || "";

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
        setstarRating(s_Rating);

        setResults(mergedHotels);
        setLoading(false);
      }, 300);
    };

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("hotelDataUpdated", handleUpdate);
    return () => window.removeEventListener("hotelDataUpdated", handleUpdate);
  }, [searchParams.toString(), apiResults]);

  console.log("hotels", apiResults);

  useEffect(() => {
    if (!results || results.length === 0) {
      setFilters((prev) => ({
        ...prev,
        maxPrice: prev.maxPrice || 2000,
        priceRange: Array.isArray(prev.priceRange)
          ? prev.priceRange
          : [0, prev.maxPrice || 2000],
      }));
      return;
    }

    const convertedPrices = results
      .map((h) => {
        const raw = Number(h?.priceInfo?.LowestPrice?.Value) || 0;
        const conv = parseConvertedNumber(convertPrice(raw));
        return Number.isFinite(conv) && conv > 0 ? conv : 0;
      })
      .filter((p) => p > 0);

    const highest = convertedPrices.length
      ? Math.ceil(Math.max(...convertedPrices))
      : 2000;

    setFilters((prev) => {
      const newMax = Math.max(highest, 1);
      const prevMin = Array.isArray(prev.priceRange)
        ? Number(prev.priceRange[0] || 0)
        : 0;
      const prevMax = Array.isArray(prev.priceRange)
        ? Number(prev.priceRange[1] || newMax)
        : newMax;

      const clampedMax = Math.min(prevMax, newMax);
      const clampedMin = Math.min(Math.max(prevMin, 0), clampedMax);

      if (
        prev.maxPrice === newMax &&
        prev.priceRange?.[0] === clampedMin &&
        prev.priceRange?.[1] === clampedMax
      ) {
        return prev;
      }

      return {
        ...prev,
        maxPrice: newMax,
        priceRange: [clampedMin, clampedMax],
      };
    });
  }, [results, currency]);

  const filteredResults = useMemo(() => {
    if (!results) return [];

    const applyConvertedPrice = (hotel) => {
      const raw = Number(hotel?.priceInfo?.LowestPrice?.Value) || 0;
      return parseConvertedNumber(convertPrice(raw));
    };

    let data = results.filter((hotel) => {
      const convPrice = applyConvertedPrice(hotel);

      if (
        filters.title &&
        !hotel?.name?.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      const r = Number(hotel?.starRating || 0);
      if (filters.rating) {
        if (filters.rating === "4+" && r < 4) return false;
        if (filters.rating === "3+" && r < 3) return false;
        if (filters.rating === "2+" && r < 2) return false;
        if (filters.rating === "1+" && r < 1) return false;
      }

      const [minP = 0, maxP = filters.maxPrice || 0] = filters.priceRange || [];
      if (convPrice < minP || convPrice > maxP) return false;

      return true;
    });

    if (sortOption) {
      const getConv = (h) =>
        parseConvertedNumber(
          convertPrice(Number(h?.priceInfo?.LowestPrice?.Value || 0))
        );
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

  console.log("Hotel_List", results);
  console.log("selected_Hotel", selectedHotelLocal);

  if (loading) {
    return (
      <>
        <Header />
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
          starRating: starRating,

          rooms:
            rooms.length > 0
              ? rooms
              : [{ adults: 1, children: 0, childrenAges: [] }],
        }}
        onClearFilters={clearFilters} // ⭐ ADD THIS
      />

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
        {results && (
          <p className="desti-count">
            {filteredResults.length} properties in {destination}
          </p>
        )}

        <div
          className="set-fil"
          style={{ display: "flex", gap: "7px", marginTop: "0px" }}
        >
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
            <div
              style={{ display: "flex", justifyContent: "center" }}
              onClick={handlePopupToggle}
            >
              <FaFilter />{" "}
              <p style={{ fontSize: "14px", fontWeight: "normal" }}>Filter</p>
            </div>
          </div>

          {results && (
            <select
              className="sort-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {/* <option value="">Sort By</option> */}
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="az">Alphabetical (A → Z)</option>
              <option value="za">Alphabetical (Z → A)</option>
            </select>
          )}
        </div>
      </div>

      <div className="results-container">
        {destination === "" ? (
          <main className="hotel-results">
            <div className="hotel-list">
              <p
                style={{
                  fontSize: "16px",
                  color: "gray",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Try searching or find other hotels
              </p>
            </div>
          </main>
        ) : (
          <>
            {results && (
              <Filters
                setShowMap={setShowMap}
                showMap={showMap}
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
              />
            )}

            {showMap && (
              <main className="hotel-results">
                <div className="hotel-list">
                  {filteredResults.length === 0 ? (
                    <p
                      style={{
                        fontSize: "16px",
                        color: "gray",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No properties found for "{destination}". Try adjusting
                      filters or search for another place.
                    </p>
                  ) : (
                    <div className="hotel-container">
                      {filteredResults.map((hotel) => {
                        const raw =
                          Number(hotel?.priceInfo?.LowestPrice?.Value) || 0;
                        const convPrice =
                          parseFloat(
                            String(
                              convertPrice(
                                raw *
                                  hotel?.priceInfo?.RatePlanList?.[0]?.PriceList
                                    .length * apiResults?.room?.length
                              )
                            ).replace(/[^0-9.\-]/g, "")
                          ) || 0;
                        return (
                          <div className="hotel-card" key={hotel.id}>
                            <div className="hotel-img-wrapper">
                              <img
                                src={
                                  hotel?.images?.find((img) => img?.url)?.url ||
                                  "/no-image.jpg"
                                }
                                alt={hotel.name}
                                className="hotel-img"
                                onError={(e) => {
                                  e.target.src =
                                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                                }}
                              />
                            </div>

                            <div className="hotel-details-c">
                              <div className="hotel-header">
                                <StarRating rating={hotel.starRating || 0} />
                                <h3>{hotel.name}</h3>
                              </div>

                              <div
                                className="m-xtx-set"
                                style={{ display: "flex" }}
                              >
                                <IoLocationOutline />
                                <p className="location">
                                  {hotel.location?.address}
                                </p>
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
                                  onClick={() => setSelectedHotelData(hotel)}
                                >
                                  See More
                                </p>
                              </span>

                              <div className="price-info top-right">
                                <p className="price">
                                  {Number.isFinite(convPrice) ? convPrice : 0}{" "}
                                  {currency}
                                </p>
                                <p className="price-sub">
                                  {(hotel.rooms || []).length} room(s)
                                </p>

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
                                        Discount:
                                          apiResults.appliedDiscount || "",
                                        Markup: apiResults.appliedMarkup || "",
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
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {selectedHotelData && (
                        <div className="popup-overlay-room">
                          <div className="popup-content-room">
                            <button
                              className="popup-close"
                              onClick={() => setSelectedHotelData(null)}
                            >
                              ✕
                            </button>

                            <div className="RatingPlusTitle">
                              <h1
                                className="hotel-title"
                                style={{ padding: "0px 12px 0px 20px" }}
                              >
                                {selectedHotelData.name}
                              </h1>
                              <div className="StartManage">
                                <StarRating rating={selectedHotelData.starRating} />
                              </div>
                            </div>

                            <div
                              className="tit-mng"
                              style={{ padding: "0px 12px 0px 20px" }}
                            >
                              <IoLocationOutline />
                              <p>{selectedHotelData.location?.address}</p>
                            </div>

                            <ImageViewer
                              images={selectedHotelData.images.map(
                                (img) => img.url
                              )}
                              location={[
                                selectedHotelData.location?.coordinate,
                                selectedHotelData.location?.latitude,
                              ]}
                            />

                            <HotelTabs
                              description={selectedHotelData?.description}
                              facility={selectedHotelData.facilities}
                            />
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
