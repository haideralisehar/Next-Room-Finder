import React, { useState } from "react";
import "../styling/RoomCard.css";
import Link from "next/link";
import { useCurrency } from "../Context/CurrencyContext";

export default function RoomCard({
  room,
  roomCount,
  id,
  name,
  location,
  price,
  image,
  from,
  to,
  rooms,
  count,
  nights,
  rating,
  onChooseRoom,
  isSelected,
  selectedRoom,
  selectedRooms,
  isTaken,
}) {
  // ✅ Use room.roomPhotos if available, otherwise fallback images

  const { currency, convertPrice } = useCurrency(); // ✅ get currency + converter
  const [currents, setCurrents] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
   const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);
  // const handlePopupToggle = () => setShowPopup(!showPopup);

  const handleChooseRoom = () => {
    onChooseRoom(room); // your existing function to select the room

    // Check if all rooms are selected, then show popup
    if (
      selectedRoom.length + 1 === selectedRooms.length && // +1 because we're just selecting this room
      selectedRoom.every(Boolean)
    ) {
      setShowPopup(true);
    }
  };

  const images =
    room.roomPhotos && room.roomPhotos.length > 0
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

  const priceValue = (room.price * room.off) / 100;
  const finalValue = (room.price - priceValue).toFixed(2);
  console.log(selectedRoom);
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
          {room.roomDetails.amenities.length > 0 && (
            <p
              style={{
                paddingTop: "10px",
                color: "#5e72e0ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setShowAmenitiesPopup(true)}
            >
              See more amenities
            </p>
          )}
        </div>
      </div>

      {/* Right container */}
      <div className="room-right">
        <div>
          <h4 style={{ fontWeight: "bold" }}>
            {/* {room.breakFast ? "Breakfast" : "Room Only"} •{" "}{room.mealPlan} */}
            {room.mealPlan} {" - "}
            {room.refund ? "Refundable" : "Non-refundable"}
          </h4>

          {room.breakFast && (room.mealPlan === "Full Board" || room.mealPlan === "Half Board") ? (
  <>
    {room.mealPlan === "Full Board" ? (
      <p>
        <span className="green">✔</span> Including Breakfast + Lunch + Dinner
      </p>
    ) : (
      <p>
        <span className="green">✔</span> Including Breakfast + Lunch (or Dinner)
      </p>
    )}
  </>
) : (
  <>
  {room.breakFast ? (
    <p>
    <span className="green">✔</span> Breakfast Included
  </p>

  ):(<p>
    <span className="red">✖</span> No Breakfast Included
  </p>)}
  
  </>
  
)}

          {room.mealPlan === "Half Board" || room.mealPlan === "Full Board"  ? (
            <p>
              <span className="green">✔</span> Pay later option available
            </p>
          ):(<p></p>)}
          {room.Cancelation ? (
            <p>
              <span className="green">✔</span> Free Cancelation
            </p>
          ) : (
            <p>
              <span className="red">✖</span> No Cancelation
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
          <span className="discount">{room.off}% OFF</span>
          <div className="old-new">
            <p className="old-price">
              {convertPrice(room.price)} {currency}
            </p>

            <h2 className="new-price">
              {convertPrice(finalValue)} {currency}
            </h2>
          </div>
          <p style={{ color: "#8a8a8aff" }}>{roomCount} room(s)</p>
          <p style={{ color: "#8a8a8aff" }}>{nights} night(s)</p>
          <p>{}</p>

          {/* <div className="selected-rooms">
        <h4>Selected Rooms:</h4>
        {rooms && rooms.length > 0 ? (
          rooms.map((r, i) => (
            <div key={i}>
              <p>Room {i + 1}</p>
              <p>Adults: {r.adults}</p>
              <p>Children: {r.children}</p>

              {r.children > 0 && (
                <ul>
                  {r.childrenAges?.map((age, idx) => (
                    <li key={idx}>Child {idx + 1} Age: {age}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p>No rooms selected</p>
        )}
      </div> */}
          {/* <Link
            href={{
              pathname: "/booking",
              query: {
                id: id,
                name: name,
                location: location,
                price: price,
                roomPrice: room.price,
                image: image,
                from: from,
                to: to,
                roomTitle: room.title,
                rooms: JSON.stringify(rooms),
                count: count,
                nights: nights, // ✅ Pass updated nights
                rating: rating,
                selroom: room.price,
                totalRooms: roomCount,
                roomCost: finalValue,
              },
            }}
          > */}

          <button
            className="choose-btn"
            disabled={isTaken}
            onClick={!isTaken ? onChooseRoom : undefined}
            style={{
              backgroundColor: isTaken? "green" : isSelected ? "green" : "#3c7dabff",
              cursor: isTaken ? "not-allowed" : "pointer",
            }}
          >
            {isTaken ? "Selected" : isSelected ? "selected" : "Choose"}
          </button>
          {/* </Link> */}
        </div>
      </div>
      {/* <Link
        href={{
          pathname: "/booking",
          query: {
            id: id,
            name: name,
            location: location,
            price: price,
            roomPrice: room.price,
            image: image,
            from: from,
            to: to,
            roomTitle: room.title,
            rooms: JSON.stringify(rooms),
            count: count,
            nights: nights, // ✅ Pass updated nights
            rating: rating,
            selroom: room.price,
            totalRooms: roomCount,
            roomCost: finalValue,
          },
        }}
      > */}
      <button
        className="choose-btn-mob"
        disabled={isTaken}
        onClick={!isTaken ? onChooseRoom : undefined}
        style={{
          backgroundColor: isTaken && isSelected ? "#ccc" : "#3c7dabff",
          cursor: isTaken ? "not-allowed" : "pointer",
        }}
      >
        {isTaken ? "Selected" : isSelected ? "selected" : "Choose"}
      </button>
      {/* </Link> */}

      {/* Popup */}

      {showAmenitiesPopup && (
        <div className="popup-overlays">
          <div className="popup-content">
            <div className="btn-cls" style={{display:"flex", justifyContent:"space-between"}}>
            <h1 style={{fontWeight:"600", paddingTop:"10px", fontSize:"18px"}}>Amenities</h1>
            <button
              className="close-btns"
              onClick={() => setShowAmenitiesPopup(false)}
            >
              Close
            </button>

            </div>
            <hr style={{color:"#eeeeeeff", margin:"5px 0px 10px 0px"}} />
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
      )}
    </div>
  );
}
