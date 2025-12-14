"use client";
import React, { useState } from "react";
import "../styling/RoomCard.css";
import { useCurrency } from "../Context/CurrencyContext";
import { useSelector } from "react-redux";


export default function RoomCard({
  room,
  roomCount,
  nights = 1,
  onChooseRoom,
  isSelected,
  selectedVariation,
  isTaken,
  hotel_id,
  count_room,
}) {
  

  const { currency, convertPrice } = useCurrency();

  const [current, setCurrent] = useState(0);
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);
  const [hoverPolicy, setHoverPolicy] = useState(null);

  const dictionaryTypes = useSelector((state) => state.search.dictionaryTypes);

 
  // meal mapping (standard)

  function getDictionaryTypes() {
    if (typeof window === "undefined") return {};

    try {
      const raw = dictionaryTypes;
      return raw;
    } catch (err) {
      console.error("Failed to parse dictionary types", err);
      return {};
    }
  }

  const dictionary = getDictionaryTypes();
  const mealOptions = dictionary?.mealTypes?.data || [];

  const mealLabel = (code, amount) => {
    const found = mealOptions.find((m) => m.code == code);
    if (found) {
      return amount ? `${found.name} (${amount})` : found.name;
    }
    return "N/A";
  };

  // ⭐ BED LABEL (similar to mealLabel)

  const bedOptions = dictionary?.bedTypes?.data || [];

  const bedLabel = (code, amount) => {
    const found = bedOptions.find((m) => m.code == code);
    if (found) {
      return amount ? `${found.name} (${amount})` : found.name;
    }

    return "N/A";
  };

  return (
    <div
      className="room-card"
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        border: "1px solid #e6e6e6",
        borderRadius: 10,
        marginBottom: 12,
      }}
    >
      {/* LEFT: room info */}
      <div className="room-left" style={{ flex: 1 }}>
        <h3 className="room-title">{room.roomDetails?.name ?? room.title}</h3>

        {/* {
          room.variations.map((variation) => {
               return(
                <div key={variation.ratePlanId}>
                    <p style={{color:"#7e7e7eff", fontSize:"13px"}}>🛏 {bedLabel(variation.raw?.BedType
                    )}</p>

                    

            
                </div>
               );

          })
         } */}

        {/* small slider preview (first image only to keep simple) */}
        {/* <div style={{ margin: "8px 0" }}>
          <img src={images[1]} alt="room" style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8 }} />
        </div> */}

        <div className="room-details">
          <h4
            style={{ fontSize: 14, borderTop: "1px solid #eee", paddingTop: 6 }}
          >
            Room Details
          </h4>
          <p style={{ fontSize: 12 }}>
            📐 {room.roomDetails?.size ?? "Not Specified"}
          </p>

          <h4 style={{ fontSize: 14 }}>Amenities</h4>
          <div
            className="facilities-list"
            style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
          >
            {Array.isArray(room.facilities) && room.facilities.length > 0 ? (
              room.facilities.map((f, i) => (
                <div
                  key={i}
                  className="facility-item"
                  style={{
                    background: "#f2f4f8",
                    padding: "6px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  {f}
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: "#777" }}>
                No facilities listed
              </div>
            )}
          </div>

          {room.roomDetails?.amenities &&
            room.roomDetails.amenities.length > 0 && (
              <p
                style={{
                  paddingTop: 10,
                  color: "#5e72e0",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 13,
                }}
                onClick={() => setShowAmenitiesPopup(true)}
              >
                See more amenities
              </p>
            )}
        </div>
      </div>

      {/* RIGHT: variations */}
      <div
        className="room-right"
        style={{
          // width: 380,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        {Array.isArray(room.variations) && room.variations.length > 0 ? (
          room.variations.map((variation) => {
            // determine selected state for this variation
            const isThisSelected =
              selectedVariation?.parentRoomId === room.id &&
              selectedVariation?.ratePlanId === variation.ratePlanId;

            return (
              <div
                key={variation.ratePlanId}
                className="room-type-box"
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="variation-info" style={{ maxWidth: "60%" }}>
                  <h4 style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                    {variation.ratePlanName} -{" "}
                    {bedLabel(variation.raw?.BedType)}
                  </h4>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {mealLabel(variation.mealType)}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#444", marginTop: 3 }}
                  ></div>

                  <div style={{ marginTop: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: variation.refundable ? "#2d8a4b" : "#c23d3d",
                      }}
                    >
                      {variation.refundable
                        ? "✔ Refundable"
                        : "✖ Non-refundable"}
                    </span>
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 12,
                        color: variation.cancellation ? "#2d8a4b" : "#c23d3d",
                        position: "relative",
                      }}
                      onMouseEnter={() =>
                        setHoverPolicy({
                          id: variation.ratePlanId,
                          policy:
                            variation.raw?.RatePlanCancellationPolicyList || [],
                        })
                      }
                      onMouseLeave={() => setHoverPolicy(null)}
                    >
                      {variation.cancellation && "✔ Cancellation Policy"}

                      {/* POPUP ONLY FOR THIS VARIATION */}
                      {hoverPolicy &&
                        hoverPolicy.id === variation.ratePlanId &&
                        hoverPolicy.policy.length > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "20px",
                              left: 0,
                              background: "#fff",
                              border: "1px solid #ccc",
                              padding: "10px",
                              fontSize: "12px",
                              borderRadius: "8px",
                              width: "260px",
                              zIndex: 999,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                color: "#2d8a4b",
                              }}
                            >
                              Cancellation Policy
                            </div>

                            {hoverPolicy.policy.map((p, i) => (
                              <div key={i} style={{ marginBottom: 6 }}>
                                <div>
                                  <strong>From:</strong> {p.FromDate}
                                </div>
                                <div>
                                  <strong>Amount:</strong>{" "}
                                  {convertPrice(p.Amount * count_room)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </span>
                  </div>
                </div>

                <div className="price-box" style={{ textAlign: "right" }}>
                  <div className="price-check">
                    {currency}{" "}
                    {convertPrice(variation.raw?.TotalPrice * count_room)}
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {currency}{" "}
                    {convertPrice(
                      (variation.raw?.TotalPrice /
                        variation.raw?.PriceList?.length) *
                        count_room
                    )}
                    /night{nights > 1 ? "s" : ""}
                  </div>

                  <button
                    className={`choose-btn ${isThisSelected ? "active" : ""} ${
                      isTaken ? "taken" : ""
                    }`}
                    disabled={isTaken && !isThisSelected}
                    onClick={() =>
                      onChooseRoom({
                        parentRoomId: room.id,
                        ratePlanId: variation.ratePlanId,
                        ratePlanName: variation.ratePlanName,
                        mealType: mealLabel(variation.mealType),

                        bedtpe: bedLabel(variation.raw?.BedType),
                        mealAmount: variation.mealAmount,
                        price: variation.price,
                        hotel_id: hotel_id,
                        currency: variation.currency,
                        refundable: variation.refundable,
                        cancellation: variation.cancellation,
                        metaData: variation.raw?.Metadata,
                        nights: variation.raw?.PriceList?.length,
                        adults: variation?.raw?.RoomOccupancy?.AdultCount,
                        childs: variation?.raw?.RoomOccupancy?.ChildCount,
                        childAges:
                          variation?.raw?.RoomOccupancy?.ChildAgeDetails,
                        RoomNum: variation?.raw?.RoomOccupancy?.RoomNum,
                      })
                    }
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      background: isThisSelected ? "#2b7bb3" : "#3c7dab",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor:
                        isTaken && !isThisSelected ? "not-allowed" : "pointer",
                      opacity: isTaken && !isThisSelected ? 0.6 : 1,
                    }}
                  >
                    {isThisSelected
                      ? "Selected"
                      : isTaken && !isThisSelected
                      ? "Unavailable"
                      : "Choose"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              width: "100%",
              padding: 12,
              border: "1px dashed #eee",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            No rate plans available
          </div>
        )}

        {/* amenities popup */}
        {showAmenitiesPopup && (
          <div className="popup-overlays">
            <div className="popup-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Amenities</h3>
                <button
                  onClick={() => setShowAmenitiesPopup(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
              <hr style={{ margin: "8px 0" }} />
              <div>
                {Array.isArray(room.roomDetails?.amenities) &&
                room.roomDetails.amenities.length > 0 ? (
                  room.roomDetails.amenities.map((a, i) => (
                    <div key={i} style={{ padding: 6 }}>
                      {a}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 6 }}>No amenities listed</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
