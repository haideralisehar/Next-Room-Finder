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

  // const formatDateTime = (date) =>
  // new Date(date).toLocaleString("en-GB", {
  //   day: "2-digit",
  //   month: "short",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: true,
  // });

  // i will use this method to convert the date and time into specified format

  function formatDateTimeExact(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
  }

  function minusOneMinute(dateString) {
    const d = new Date(dateString);
    d.setMinutes(d.getMinutes() - 1);
    return formatDateTimeExact(d);
  }

  // function to get today Date and Time
  function getTodayDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
  }

  function isPolicyExpired(policyList) {
  const now = new Date();

  return policyList.some(
    (p) => new Date(p.FromDate) <= now
  );
}





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

              const policyList =
  variation.raw?.RatePlanCancellationPolicyList || [];

const expiredPolicy = isPolicyExpired(policyList);

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
    color:
      variation.refundable && !expiredPolicy
        ? "#2d8a4b"
        : "#c23d3d",
  }}
>
  {variation.refundable && !expiredPolicy
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
    policy: policyList,
  })
}

                      onMouseLeave={() => setHoverPolicy(null)}
                    >
                    {variation.cancellation && !expiredPolicy && "✔ Cancellation Policy"}



                      {/* POPUP ONLY FOR THIS VARIATION */}
                      {!expiredPolicy &&
  hoverPolicy &&
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
                            <p style={{cursor:"pointer"}}>  Cancellation Policy </p>
                            </div>

                            {(() => {
                              const policies = [...hoverPolicy.policy].sort(
                                (a, b) =>
                                  new Date(a.FromDate) - new Date(b.FromDate)
                              );

                              return (
                                <div
                                  style={{ fontSize: 12, lineHeight: "1.6" }}
                                >
                                  {/* 1️⃣ NOW → first policy (FREE) */}
                                  <p>
                                    Cancellation from {getTodayDateTime()} up to{" "}
                                    {minusOneMinute(policies[0].FromDate)}{" "}
                                    <strong>0 BHD (Free)</strong>
                                  </p>

                                  {/* 2️⃣ Middle ranges */}
                                  {policies.length > 1 &&
                                    policies.slice(0, -1).map((p, i) => (
                                      <p key={i}>
                                        Cancellation from{" "}
                                        {formatDateTimeExact(p.FromDate)} up to{" "}
                                        {minusOneMinute(
                                          policies[i + 1].FromDate
                                        )}{" "}
                                        <strong>{p.Amount} BHD</strong>
                                      </p>
                                    ))}

                                  {/* 3️⃣ After last policy */}
                                  <p>
                                    Cancellation after{" "}
                                    {formatDateTimeExact(
                                      policies[policies.length - 1].FromDate
                                    )}{" "}
                                    <strong>
                                      {policies[policies.length - 1].Amount} BHD
                                      (Charges)
                                    </strong>
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                    </span>
                  </div>
                </div>

                <div className="price-box" style={{ textAlign: "right" }}>
                  <div className="price-check">
                    {currency}{" "}
                    {(variation?.raw?.TotalPrice * count_room).toFixed(2)}
                    {/* {convertPrice(variation.raw?.TotalPrice * count_room)} */}
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {currency} {/* {convertPrice( */}
                    {/* ( */}
                    {(
                      (variation.raw?.TotalPrice /
                        variation.raw?.PriceList?.length) *
                      count_room
                    ).toFixed(2)}
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
