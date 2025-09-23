import React, { useState } from "react";
import "../styling/RoomCard.css";
import { useCurrency } from "../Context/CurrencyContext";

export default function RoomCard({
  room,
  roomCount,
  nights,
  onChooseRoom,
  isSelected,
  selectedVariation,
  isTaken, // ✅ NEW prop
}) {
  const { currency, convertPrice } = useCurrency();
  const [current, setCurrent] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);

  const images =
    room.roomPhotos?.length > 0
      ? room.roomPhotos
      : [
          "https://static.cupid.travel/hotels/508614426.jpg",
          "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?w=600",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600",
        ];

  return (
    <div className="room-card">
      {/* Left: Room Info */}
      <div className="room-left">
        <h3 className="room-title">{room.title}</h3>

        {/* Slider */}
        <div className="slider">
          <div
            className="slider-wrapper"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img key={index} src={img} alt="Room" />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrent((p) => (p - 1 + images.length) % images.length)
            }
            className="nav-btn left"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % images.length)}
            className="nav-btn right"
          >
            ›
          </button>
        </div>

        {/* Room Details */}
        <div className="room-details">
          <h4 style={{fontSize:"14px"}}>Room Details</h4>
          <p style={{fontSize:"12px"}}>
            🛏 Sleeps {room.fitForAdults} | 📐 {room.roomDetails.size}
          </p>

          <h4 style={{fontSize:"14px"}}>Amenities</h4>
          <div className="facilities-list">
            {room.roomDetails.amenities?.length > 0 ? (
              room.roomDetails.amenities.map((item, i) => (
                <div key={i} className="facility-item">
                  <span className="icon" >i</span>
                  <p style={{fontSize:"12px"}}>{item}</p>
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
                fontSize:"13px"
              }}
              onClick={() => setShowAmenitiesPopup(true)}
            >
              See more amenities
            </p>
          )}
        </div>
      </div>

      {/* Right: Variations */}
      <div className="room-right">
        {room.variations?.length > 0 ? (
          room.variations.map((variation, idx) => {
            const isThisSelected =
              selectedVariation?.parentRoomId === room.id &&
              selectedVariation?.mealPlan === variation.mealPlan;

            return (
              <div key={idx} className="room-type-box">
                <div className="variation-info">
                  <h4 style={{ fontWeight: "600", fontSize: "14px" }}>
                    {variation.mealPlan} -{" "}
                    {variation.refund ? "Refundable" : "Non-refundable"}
                  </h4>
                  {/* <p>{variation.refund ? "Refundable" : "Non-refundable"}</p> */}
                  {variation.breakfast &&
                    variation.mealPlan === "Full Board" && (
                      <p  className="txt-rsiz">
                        <span className="green">✔</span> Including Breakfast +
                        Lunch + Dinner
                      </p>
                    )}{" "}
                  {variation.breakfast &&
                    variation.mealPlan === "Half Board" && (
                      <p className="txt-rsiz">
                        <span className="green">✔</span> Including Breakfast +
                        Lunch (or Dinner)
                      </p>
                    )}{" "}
                  {variation.breakfast &&
                    variation.mealPlan === "Bed and Breakfast" && (
                      <p className="txt-rsiz">
                        <span className="green">✔</span> Breakfast Included
                      </p>
                    )}{" "}
                  {!variation.breakfast && (
                    <p className="txt-rsiz">
                      <span className="red">✖</span> No Breakfast Included
                    </p>
                  )}{" "}
                  {variation.cancellation ? (
                    <p className="txt-rsiz">
                      <span className="green">✔</span> Free Cancellation
                    </p>
                  ) : (
                    <p className="txt-rsiz">
                      <span className="red">✖</span> No Cancellation
                    </p>
                  )}{" "}
                  {variation.refund ? (
                    <p className="txt-rsiz">
                      <span className="green">✔</span> Refundable
                    </p>
                  ) : (
                    <p className="txt-rsiz">
                      <span className="red">✖</span> No-Refundable
                    </p>
                  )}
                </div>

                <div className="price-box">
                  <span className="discount">{variation.off} OFF</span>
                  <p className="old-price">
                    {convertPrice(variation.oldprice)} {currency}
                  </p>
                  <h2 className="new-price">
                    {convertPrice(variation.price)} {currency}
                  </h2>
                  <p className="small-text">
                    {roomCount} room(s) - {nights} night(s)
                  </p>
                  {/* <p className="small-text"></p> */}

                  <button
                    className={`choose-btn 
                      ${isThisSelected ? "active" : ""} 
                      ${isTaken ? "taken" : ""}`}
                    disabled={isTaken} // ✅ disable if taken
                    onClick={() =>
                      onChooseRoom({
                        parentRoomId: room.id,
                        roomName: room.title,
                        mealPlan: variation.mealPlan,
                        price: variation.price,
                        oldPrice: variation.oldprice,
                        off: variation.off,
                        refund: variation.refund,
                        breakfast: variation.breakfast,
                        cancellation: variation.cancellation,
                      })
                    }
                  >
                    {isTaken
                      ? "Already Selected"
                      : isThisSelected
                      ? "Selected"
                      : "Choose"}
                  </button>

                  <button
                    className={`choose-btn-mob 
                      ${isThisSelected ? "active" : ""} 
                      ${isTaken ? "taken" : ""}`}
                    disabled={isTaken} // ✅ disable if taken
                    onClick={() =>
                      onChooseRoom({
                        parentRoomId: room.id,
                        roomName: room.title,
                        mealPlan: variation.mealPlan,
                        price: variation.price,
                        oldPrice: variation.oldprice,
                        off: variation.off,
                        refund: variation.refund,
                        breakfast: variation.breakfast,
                        cancellation: variation.cancellation,
                      })
                    }
                  >
                    {isTaken
                      ? "Already Selected"
                      : isThisSelected
                      ? "Selected"
                      : "Choose"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No room variations available</p>
        )}
        {showAmenitiesPopup && (
          <div className="popup-overlays">
            <div className="popup-content">
              {/* Header with title + close button */}
              <div
                className="btn-cls"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h1
                  style={{
                    fontWeight: "600",
                    paddingTop: "10px",
                    fontSize: "18px",
                  }}
                >
                  Amenities
                </h1>
                <button
                  className="close-btns"
                  onClick={() => setShowAmenitiesPopup(false)}
                >
                  Close
                </button>
              </div>

              <hr style={{ color: "#eeeeeeff", margin: "5px 0px 10px 0px" }} />

              {/* Facilities List */}
              <div className="facilities-list">
                {Array.isArray(room.roomDetails?.amenities) &&
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
    </div>
  );
}
