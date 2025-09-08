"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import "../hotel-view/hotel.css"; // create CSS file for styling
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoLocationOutline } from "react-icons/io5";
import Link from "next/link";
import StarRating from "../components/rating"
import HotelTabs from "../components/tabs"
import "../styling/ImageViewer.css"
import ImageViewer from "../components/ImageViewer";

export default function HotelView() {
  const searchParams = useSearchParams();

  const hotel = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    location: searchParams.get("location"),
    price: searchParams.get("price"),
    image: searchParams.get("image"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    rooms: searchParams.get("rooms") ? JSON.parse(searchParams.get("rooms")) : [],
    count: searchParams.get("count"),
    nights: searchParams.get("nights"),
    rating: searchParams.get("rating"),
    description: searchParams.get("description"),
    facilities: searchParams.get("facility") ? JSON.parse(searchParams.get("facility")): [],

  };
const images = [
    "https://static.cupid.travel/hotels/607490031.jpg",
    "https://static.cupid.travel/hotels/612441158.jpg",
    "https://static.cupid.travel/hotels/612441406.jpg",
    "https://static.cupid.travel/hotels/612441406.jpg",
    "https://static.cupid.travel/hotels/612441158.jpg",
    "https://static.cupid.travel/hotels/612441406.jpg",
    "https://static.cupid.travel/hotels/612441406.jpg",
  ];
  return (
    <>
      <Header />
      <div className="hotel-view-container">
        {/* Hotel Name & Location */}
        <div style={{display:"flex", padding:"15px 0px 0px 0px"}}>
          <h1 className="hotel-title" style={{ padding:"0px 12px 0px 0px"}}>{hotel.name}</h1>
          <div style={{marginTop:"13px"}}>
            <StarRating rating={hotel.rating }/>
          </div>
          
        </div>
        
        <div className="tit-mng">
          <IoLocationOutline />
          <p>{hotel.location}</p>
          
        </div>

        {/* Hotel Image */}
        {/* <img src={hotel.image} alt={hotel.name} className="hotel-view-img" /> */}
        <ImageViewer images={images} />
        <HotelTabs description={hotel.description} facility={hotel.facilities}/>
        

        {/* Facilities */}
        {/* <h2 className="section-title">Facilities</h2>
        <div className="facilityList">
          <span>✅ Free breakfast</span>
          <span>✅ Free WiFi</span>
          <span>✅ 24-hour front desk</span>
          <span>✅ Safe deposit box</span>
          <span>✅ Smoke-free property</span>
          <span>✅ Free parking</span>
        </div> */}

        {/* Amenities */}
        <h2 className="section-title">Amenities</h2>
        <p>🛏 Sleeps 5 | 🚿 Shower | ❄ Air conditioning</p>
        <p>🍳 Breakfast Included | 🚫 Non-refundable</p>

        {/* Hotel Details */}
        {/* <div className="hotel-details">
          <p>
            <strong>Check-in:</strong>{" "}
            {hotel.from ? hotel.from.slice(0, 10) : "N/A"}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {hotel.to ? hotel.to.slice(0, 10) : "N/A"}
          </p>
          <p>
            <strong>Nights:</strong> {hotel.nights}
          </p>
          <p>
            <strong>Rooms:</strong> {hotel.count}
          </p>
          <p>
            <strong>Price per night:</strong> ${hotel.price}
          </p>
          <p>
            <strong>Total Price:</strong>{" "}
            ${Number(hotel.price) * Number(hotel.count) * Number(hotel.nights)}
          </p>
        </div> */}

        {/* Proceed to Booking */}
        <Link
          href={{
            pathname: "/booking",
            query: {
              id: hotel.id,
              name: hotel.name,
              location: hotel.location,
              price: hotel.price,
              image: hotel.image,
              from: hotel.from,
              to: hotel.to,
              rooms: JSON.stringify(hotel.rooms),
              count: hotel.count,
              nights: hotel.nights,
              rating: hotel.rating
            },
          }}
        >
          <button className="confirm-btn">Proceed to Booking</button>
        </Link>
      </div>

      <Footer />
    </>
  );
}
