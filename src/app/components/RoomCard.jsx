import React, { useState } from "react";
import "../styling/RoomCard.css";
import Link from "next/link";

export default function RoomCard({ room, roomCount,id, name, location, price, image, from, to, rooms, count, nights, rating
 }) {
  // ✅ Use room.roomPhotos if available, otherwise fallback images
  const images = room.roomPhotos && room.roomPhotos.length > 0
    ? room.roomPhotos
    : [
        "https://static.cupid.travel/hotels/508614426.jpg",
        "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60",
      ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="room-card">
      {/* Left container */}
      <div className="room-left">
        <h3 style={{ fontWeight: "bold" }}>{room.title}</h3>

        {/* ✅ Slider uses room.roomPhotos */}
        <div className="slider">
          <div
            className="slider-wrapper"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img key={index} src={img} alt="Room" />
            ))}
          </div>

          <button onClick={prevSlide} className="nav-btn left">
            ‹
          </button>
          <button onClick={nextSlide} className="nav-btn right">
            ›
          </button>

          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${current === index ? "active" : ""}`}
                onClick={() => setCurrent(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div className="room-details">
          <h4 style={{ fontWeight: "bold" }}>Room Details</h4>
          <p>
            🛏 Sleeps {room.fitForAdults} | 📐 {room.roomDetails.size}
          </p>
          
          <h4 style={{ fontWeight: "bold" }}>Amenities</h4>
          <div className="facilities-list">
            {Array.isArray(room.roomDetails.amenities) &&
            room.roomDetails.amenities.length > 0 ? (
              room.roomDetails.amenities.map((item, i) => (
                <div key={i} className="facility-item">
                  <span className="icon">i</span>
                  {item}
                </div>
              ))
            ) : (
              <p>No facilities listed</p>
            )}
          </div>
        </div>
      </div>

      {/* Right container */}
      <div className="room-right">
        <div>
          <h4 style={{ fontWeight: "bold" }}>
            {room.breakFast ? "Breakfast" : "Room Only"} •{" "}
            {room.refund ? "Refundable" : "Non-refundable"}
          </h4>

          {room.breakFast ? (
            <p>
              <span className="green">✔</span> Breakfast Included
            </p>
          ) : (
            <p>
              <span className="red">✖</span> No Meal Included
            </p>
          )}

          {room.refund ? (
            <p>
              <span className="green">✔</span> Refundable
            </p>
          ) : (
            <p>
              <span className="red">✖</span> Non-refundable
            </p>
          )}
        </div>

        <div className="price-box">
          <span className="discount">8% OFF</span>
          <div className="old-new">
            <p className="old-price">91.669 SAR</p>
            <h2 className="new-price">{room.price} SAR</h2>
          </div>
          <p style={{ color: "#8a8a8aff" }}>1 room(s)</p>
          <p style={{ color: "#8a8a8aff" }}>{nights} night(s) incl. taxes</p>
          <Link
          href={{
            pathname: "/booking",
            query: {
              id: id,
              name: name,
              location: location,
              price: price,
              image: image,
              from: from,
              to: to,
              rooms: rooms,
              count: count,
              nights: nights, // ✅ Pass updated nights
              rating: rating,
              selroom: room.price
            },
          }}
        >
          <button className="choose-btn">Choose Room</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
