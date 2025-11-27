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
import Filters from "../components/filter"; // ✅ Import Filters component
import MobFilter from "../components/MobFilter";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import StarRating from "../components/rating";
import { useCurrency } from "../Context/CurrencyContext";
import dynamic from "next/dynamic";
import ImageViewer from "../components/ImageViewer";
import HotelTabs from "../components/tabs";
import SmartImage from "../components/SmartImages";



const MapWithPrices = dynamic(() => import("../MapView/MapShow"), {
  ssr: false,
});
export default function ResultsContent() {
  const searchParams = useSearchParams();

  const { currency, convertPrice } = useCurrency();
  const [showRoomPopup, setShowRoomPopup] = useState(false);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [nights, setNights] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [facilities, setFacility] = useState([]);
  const handlePopupToggle = () => setShowPopup(!showPopup);
  const [showMap, setShowMap] = useState(true); // map show
  const [selectedHotel, setSelectedHotel] = useState(null);


  // ✅ Filters state
  const [filters, setFilters] = useState({
    title: "",
    rating: "",
    priceRange: [0, 500],
  });

  // ✅ Sorting state
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {

      const stored = sessionStorage.getItem("hotelData");

  if (!stored) {
    console.error("No hotel data found in sessionStorage");
    setLoading(false);
    return;
  }

  const apiResponse = JSON.parse(stored);

  // const hotels = apiResponse || [];
  // setResults(hotels);   

  const hotels = apiResponse.hotelDetails?.data || [];
const hotelList = apiResponse.prices?.Success?.PriceDetails?.HotelList || [];

// Convert hotelList to a fast lookup map
const hotelListMap = new Map(
  hotelList.map(h => [h.HotelID, h])
);

// Keep only hotels that exist in BOTH lists
const mergedHotels = hotels
  .filter(hotel => hotelListMap.has(hotel.id))    // 👈 ONLY MATCHING IDs
  .map(hotel => ({
    ...hotel,
    priceInfo: hotelListMap.get(hotel.id),        // attach pricing
  }));




// setResults(mergedHotels);


  // console.log("Hotels:", hotels.totalHotels);
  // console.log("total", results.totalHotels);


    setTimeout(() => {
      const dest = searchParams.get("destination") || "";
      const f = searchParams.get("checkIn") || "";
      const t = searchParams.get("checkOut") || "";
      const n = searchParams.get("nights") || "";
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
      setNights(n);
      setRooms(r);
      setResults(hotelsData[dest] || []);
      setLoading(false);
      setDescription(d);
     setResults(mergedHotels);


    }, 300);
  }, [searchParams]);

  console.log("Hotels_List:", results);
  console.log("selected",selectedHotel);

  // ✅ Filtering + Sorting logic
  // const filteredResults = useMemo(() => {
  //   let data = results.filter((hotel) => {
  //     // Title search
  //     if (
  //       filters.title &&
  //       !hotel.name.toLowerCase().includes(filters.title.toLowerCase())
  //     ) {
  //       return false;
  //     }

  //     // Rating filter
  //     if (filters.rating) {
  //       const rating = parseFloat(hotel.rating);
  //       if (filters.rating === "4+" && rating < 4) return false;
  //       if (filters.rating === "3+" && rating < 3) return false;
  //       if (filters.rating === "2+" && rating < 2) return false;
  //       if (filters.rating === "1+" && rating < 1) return false;
  //     }

  //     // Price filter
  //     const [minPrice, maxPrice] = filters.priceRange;
  //     if (hotel.price < minPrice || hotel.price > maxPrice) {
  //       return false;
  //     }

  //     return true;
  //   });

  //   // ✅ Apply Sorting
  //   if (sortOption) {
  //     data = [...data].sort((a, b) => {
  //       switch (sortOption) {
  //         case "price-low":
  //           return a.price - b.price;
  //         case "price-high":
  //           return b.price - a.price;
  //         case "az":
  //       return a.name.localeCompare(b.name);
  //     case "za":
  //       return b.name.localeCompare(a.name);
  //     default:
  //       return 0;
  //       }
  //     });
  //   }

  //   return data;
  // }, [results, filters, sortOption]);

  // ✅ Clear filters
  const clearFilters = () => {
    setFilters({
      title: "",
      rating: "",
      priceRange: [0, 500],
    });
  };

  

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
    rooms: rooms.length > 0 ? rooms : [
      { adults: 1, children: 0, childrenAges: [] }
    ]
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
          {/* Overlay layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(44, 161, 220, 0.24)", // semi-transparent
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            {/* Centered button */}
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

      {/* --- Top bar with results count + sort --- */}
      <div className="nf-pro">
        <p className="desti-count">
          
       {results.length} properties in {destination}
        </p>

        
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
          {/* ✅ Sort Dropdown (aligned right) */}
          <select
  className="sort-dropdown"
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
>
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
          // --- Show message only ---
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

                {/* {results.hotelDetails.data[0].language} */}
              </p>
            </div>
          </main>
        ) : (
          // --- Show Filters + Results ---
          <>
            {/* Filters Sidebar */}
            <Filters
              setShowMap={setShowMap}
              showMap={showMap}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />

            {/* Hotel Results */}

            {showMap && (
              <main className="hotel-results">
                <div className="hotel-list">
                  {results.length === 0 ? (
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
                    // filteredResults.map((hotel) => (
                     
                      
                      // </Link>

//                       results.map((hotel) => (
//   <div key={hotel.id} className="hotel-card">

//     <h2>{hotel.name}</h2>

//     {/* star rating */}
//     <StarRating rating={hotel.starRating} />

//     {/* hotel image if any */}
//     {/* <img src={hotel.imageUrl} alt={hotel.name} /> */}

//     {/* Prices */}
//     {hotel.priceInfo ? (
//       <div>
//         <p><strong>Price Available</strong></p>
//         <p>Hotel ID: {hotel.priceInfo.HotelID}</p>
//         {/* Add any other pricing info */}
//       </div>
//     ) : (
//       <p>No pricing found</p>
//     )}

//   </div>
// ))


    
<div className="hotel-container">
  {results.length === 0 && <p className="no-data">No hotels found.</p>}

  {results.map((hotel) => (
    <div className="hotel-card" key={hotel.id}>
                        {/* Left: Image */}

                        <div className="hotel-img-wrapper">
  <img
    src={
      hotel?.images?.find(img => img?.url)?.url || "/no-image.jpg"
    }
    alt={hotel.name}
    className="hotel-img"
    onError={(e) => { e.target.src = "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"; }}
  />

  {/* <SmartImage
  images={hotel.images.map(img => img.url)}
  alt={hotel.name}
  className="hotel-img"
/> */}

</div>

                        {/* Right: Details */}
                        <div className="hotel-details">
                          <div className="hotel-header">
                            <StarRating rating={hotel.starRating || 0} />
                            <h3>{hotel.name}</h3>
                          </div>

                          <div
                            className="m-xtx-set"
                            style={{ display: "flex" }}
                          >
                            <IoLocationOutline />
                            <p className="location">{hotel.location.address}</p>
                          </div>

                          <p
                            style={{
                              fontSize: "12px",
                              color: "red",
                              paddingBottom: "0px",
                            }}
                          >
                            🚫 Non-Refundable
                          </p>
                          <span>
                            {/* {hotel.rating >= 3 ? "Very Good" : "Good"} */}
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
                              {/* <strong>
            {hotel?.priceInfo?.LowestPrice?.Value
              ? hotel.priceInfo.LowestPrice.Value
              : "N/A"}
          </strong> */}
                              {convertPrice(hotel.priceInfo.LowestPrice.Value)} {currency}
                            </p>
                            <p className="price-sub">
                              {hotel.rooms.length} room(s)
                              
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
                                cursor:"pointer"
                              }}
                            >
                              Book Now
                            </button>
                            
                          </div>

                          
                        </div>
                        {/* {showRoomPopup && (
                          <div className="popup-overlay-room">
                            <div className="popup-content-room">
                              <button
                                className="popup-close"
                                onClick={() => setShowRoomPopup(false)}
                              >
                                ✕
                              </button>
                             
                              <div className="RatingPlusTitle">
                                <h1
                                  className="hotel-title"
                                  style={{ padding: "0px 12px 0px 20px" }}
                                >
                                  {hotel.name}
                                </h1>
                                <div className="StartManage">
                                  <StarRating rating={hotel.starRating} />
                                </div>
                              </div>

                              <div
                                className="tit-mng"
                                style={{ padding: "0px 12px 0px 20px" }}
                              >
                                <IoLocationOutline />
                                <p>{hotel.location.address}</p>
                              </div>
                              <ImageViewer
                                images={hotel.images}
                                location={[
                                  hotel.location.coordinate,
                                  hotel.location.latitude,
                                ]}
                              />

                             

                             

                               <HotelTabs description={hotel.description} facility={"sad"} />
                            </div>
                          </div>
                          
                        )} */}

                       

                      </div>
                      
  ))}

   {selectedHotel && (
  <div className="popup-overlay-room">
    <div className="popup-content-room">
      <button
        className="popup-close"
        onClick={() => setSelectedHotel(null)}
      >
        ✕
      </button>

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
        <p>{selectedHotel.location.address}</p>
      </div>

      <ImageViewer
  images={selectedHotel.images.map(img => img.url)}   // <— FIX
  location={[
    selectedHotel.location.coordinate,
    selectedHotel.location.latitude,
  ]}
/>


      <HotelTabs
        description={selectedHotel?.description}
        facility={selectedHotel.facilities}
      />
    </div>
  </div>
)}
</div>


                    

                    
                  )}
                  

                  {/* --- Popup Modal --- */}
                </div>
              </main>
            )}

            {!showMap && (
              <div className="map-con">
                <MapWithPrices
                  hotels={filteredResults}
                  from={from}
                  to={to}
                  nights={nights}
                  rooms={rooms}
                />
              </div>
            )}
          </>
        )}

        {showPopup && (
          <div className="popup-overlay">
            {" "}
            <div className="popup">
              {" "}
              <MobFilter
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                handlePopupToggle={handlePopupToggle}
              />{" "}
            </div>{" "}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
