"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import HotelFilterBar from "../components/RoomFilter";
import RoomSelection from "../components/ChooseRoom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../hotel-view/hotel.css";
import { useHotelData } from "../Context/SelectHotelContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Image from "next/image";
import {
  priceConfirmStart,
  priceConfirmSuccess,
  priceConfirmFailure
} from "../redux/roomslice.js";


export default function HotelView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const buttonRef = useRef(null);

  const dispatch = useDispatch();

    const selectedHotelData = useSelector((state) => state.hotel.selectedHotel);
    console.log("selected_data",selectedHotelData);

  // const { apiResultsData, selectedHotelData } = useHotelData();

  const hotel_id = searchParams.get("hotelId");

  // hotel basic info from query params (keeps parity with your existing code)
  const hotel = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    nights: Number(searchParams.get("nights") || 1),
    rooms: searchParams.get("rooms") ? JSON.parse(searchParams.get("rooms")) : [],
    rating: searchParams.get("rating"),
  };

  // requested rooms count (from previous search)
  const requiredRooms = Array.isArray(hotel.rooms) && hotel.rooms.length > 0 ? hotel.rooms.length : 1;

  // state
  const [loading, setLoading] = useState(true);
  const [mergedRooms, setMergedRooms] = useState([]); // grouped rooms with variations
  const [baseFilteredRooms, setBaseFilteredRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomsInfo, setSelectedRoomsInfo] = useState(Array(requiredRooms).fill(null)); // slots
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [hotelId, sethotelId] = useState("");
  const [checkIn, setcheckIn] = useState("");
  const [checkOut, setcheckOut] = useState("");
  const [loadingfetch, setLoadingfetch] = useState(false);
  

  // --- useEffect: merge price_info + room_info into grouped rooms with variations
useEffect(() => {
  // const s_hotel = sessionStorage.getItem("selectedHotel");

  if (!selectedHotelData) {
    console.error("No rooms data found in sessionStorage.selectedHotel");
    setLoading(false);
    return;
  }

  try {
    const apiResponse = selectedHotelData;

    const checkIn = apiResponse.checkIn || "";
    const checkOut = apiResponse.checkOut || "";
    const address = apiResponse.location?.address || "";

    const hotel_Id = apiResponse.id || "";
    sethotelId(hotel_Id);
    setcheckIn(checkIn);
    setcheckOut(checkOut);


    const rating = apiResponse.starRating || "";

    const price_info = apiResponse.priceInfo?.RatePlanList || [];
    const room_info = apiResponse.rooms || [];

    // Normalize numeric ID safely
    const normalizeId = (v) => Number(v ?? 0);

    // Create room map for fast lookup
    const roomMap = new Map(
      (room_info || []).map((r) => [
        normalizeId(r.id ?? r.RoomTypeID ?? r.RoomTypeId ?? r.RoomType),
        r,
      ])
    );

    const grouped = new Map();

    price_info.forEach((plan) => {
      const roomTypeId = normalizeId(
        plan.RoomTypeID ?? plan.RoomTypeId ?? plan.RoomType
      );

      const roomDetail =
        roomMap.get(roomTypeId) || plan.roomDetails || null;

      // Price extraction priority
      const priceFromList =
        plan?.PriceList?.[0]?.Price ??
        plan?.Prices?.[0]?.Price?.Amount ??
        plan?.TotalPrice ??
        plan?.displayPrice ??
        0;

      // Currency
      const currency =
        plan?.Currency ??
        plan?.Prices?.[0]?.Currency ??
        "USD";

      // Meal type fallback logic
      const mealType =
        plan?.PriceList?.[0]?.MealType ??
        plan?.Prices?.[0]?.MealType ??
        plan?.BreakfastType ??
        plan?.mealType ??
        "N/A";

      const mealAmount =
        plan?.PriceList?.[0]?.MealAmount ??
        plan?.Prices?.[0]?.MealAmount ??
        undefined;

      // Cancellation/refund heuristics
      const refundable =
        Array.isArray(plan?.RatePlanCancellationPolicyList) &&
        plan.RatePlanCancellationPolicyList.length > 0;

      const cancellation =
        Array.isArray(plan?.RatePlanCancellationPolicyList) &&
        plan.RatePlanCancellationPolicyList.length > 0;

      // Build variation object
      const variation = {
        ratePlanId:
          plan?.RatePlanID ??
          plan?.RatePlanId ??
          `${roomTypeId}_${Math.random().toString(36).slice(2, 8)}`,
        ratePlanName:
          plan?.RatePlanName ??
          plan?.RoomName ??
          "Rate Plan",
        price: Number(priceFromList) || 0,
        currency,
        mealType,
        mealAmount,
        refundable,
        cancellation,
        raw: plan,
      };

      // Key for grouped entry
      const roomKey =
        roomTypeId ?? roomDetail?.id ?? variation.ratePlanId;

      // First time this room appears
      if (!grouped.has(roomKey)) {
        const facilities = [];

        if (roomDetail) {
          if (roomDetail.hasWifi) facilities.push("Free WiFi");
          if (roomDetail.hasWindow) facilities.push("Window");
          if (roomDetail.size) facilities.push(`Size: ${roomDetail.size}`);
        }

        grouped.set(roomKey, {
          id: roomKey,
          roomTypeId: roomKey,
          title:
            roomDetail?.name ??
            plan?.RoomName ??
            plan?.RatePlanName ??
            "Room",
          roomDetails: roomDetail,
          fitForAdults:
            roomDetail?.maxOccupancy ??
            roomDetail?.StandardOccupancy ??
            plan?.RoomOccupancy?.AdultCount ??
            1,
          fitForChildren:
            roomDetail?.ChildCount ??
            plan?.RoomOccupancy?.ChildCount ??
            0,
          facilities,
          variations: [variation],

          checkIn,
          checkOut,
          hotel_Id,
          rating

        });
      } else {
        // Existing room → add variation
        grouped.get(roomKey).variations.push(variation);
      }
    });

    const mergedArray = Array.from(grouped.values());

    // Fallback: rooms exist but grouped is empty
    if (mergedArray.length === 0 && Array.isArray(room_info) && room_info.length > 0) {
      const fallback = room_info.map((r) => ({
        id: r.id,
        roomTypeId: r.id,
        title: r.name ?? r.RoomName ?? "Room",
        roomDetails: r,
        fitForAdults:
          r.maxOccupancy ??
          r.StandardOccupancy ??
          1,
        fitForChildren: r.ChildCount ?? 0,
        facilities: [
          ...(r.hasWifi ? ["Free WiFi"] : []),
          ...(r.hasWindow ? ["Window"] : []),
          ...(r.size ? [`Size: ${r.size}`] : []),
        ],
        variations: [],
      }));

      setMergedRooms(fallback);
      setBaseFilteredRooms(fallback);
      setFilteredRooms(fallback);
    } else {
      setMergedRooms(mergedArray);
      setBaseFilteredRooms(mergedArray);
      setFilteredRooms(mergedArray);
      
    }

    setLoading(false);
    toast.info(
      `${mergedArray.length || room_info.length} room(s) available`,
      { autoClose: 1500 }
    );

    console.log("Merged grouped rooms:", mergedArray);
    // console.log("Merged grouped rooms:", mergedArray[0].checkIn.split(" ")[0]);
  } catch (err) {
    console.error("Failed to parse selectedHotel:", err);
    setLoading(false);
    toast.error("Failed to load room data", { autoClose: 2000 });
  }
}, []);

// console.log(address);
console.log("nights", selectedHotelData)




  // handle filter change (simple)
  const handleFilterChange = ({ roomName, mealType } = {}) => {
    if (!baseFilteredRooms.length) return;
    let list = [...baseFilteredRooms];
    if (roomName) list = list.filter((r) => r.title?.toLowerCase().includes(roomName.toLowerCase()));
    if (mealType) {
      list = list
        .map((r) => ({ ...r, variations: r.variations.filter((v) => v.mealType?.toString() === mealType.toString()) }))
        .filter((r) => r.variations && r.variations.length > 0);
    }
    setFilteredRooms(list);
    toast.info(`${list.length} result(s)`, { autoClose: 1200 });
  };

  // is a room already taken by another slot?
  const isTaken = (roomId) =>
    selectedRoomsInfo.some((s, idx) => s?.parentRoomId === roomId && idx !== currentRoomIndex);

  // handle choose variation for current slot
 const handleChooseRoom = async (parentRoomId, variation) => {
  const updated = [...selectedRoomsInfo];
  updated[currentRoomIndex] = { ...variation, parentRoomId };

  // Log selected room
  console.log("Selected room in current slot:", updated[currentRoomIndex]);
  console.log("All selected rooms so far:", updated[0].metaData);
  console.log("nights:", updated[0].nights);

  setSelectedRoomsInfo(updated);

  const allSelected = updated.filter(Boolean).length === requiredRooms;

  // If all required rooms selected → call API
  if (allSelected) {
    try {
      setLoadingfetch(true);

      const body = {
        PreBook: true,
        CheckInDate: checkIn.split(" ")[0],
        CheckOutDate: checkOut.split(" ")[0],
        NumOfRooms: 1,
        HotelID: hotelId,
        OccupancyDetails: [
          {
            AdultCount: updated[0].adults,
            ChildCount: updated[0].childs,
            RoomNum: updated[0].RoomNum,
            ChildAgeDetails: updated[0].childAges || []
          }
        ],
        Currency: "USD",
        Nationality: "PK",
        RatePlanID:  updated[0].ratePlanId,
        IsNeedOnRequest: false,
        Metadata: updated[0].metaData
      };

      const res = await fetch("/api/priceConfirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        alert("API Error: Something went wrong!");
        return;
      }

      const data = await res.json();
      const modifiedData = {
  ...data,
  address: selectedHotelData.location?.address || "",
  rating: selectedHotelData.starRating || "",
  nights: updated[0].nights || "",
  image: selectedHotelData.images[0].url,
  Discounts: selectedHotelData.Discount,
  Markups: selectedHotelData.Markup,

};
      dispatch(priceConfirmSuccess(modifiedData)); 
      console.log(modifiedData);

      if (!data.success) {
        alert(`Error: ${data.error || "Unknown error"}`);
        dispatch(priceConfirmFailure(data.error));
        setLoadingfetch(false);
        return;
      }

      router.push("/booking");
    } catch (err) {
      console.error(err);
      alert("Network error! Please try again.");
      setLoadingfetch(false);
    } finally {
      setLoadingfetch(false);
    }
    return; // stop further execution
  }

  // If not all rooms selected, move to next room slot
  if (currentRoomIndex < requiredRooms - 1) {
    setCurrentRoomIndex((prev) => prev + 1);
  }
};




  // auto-scroll + shake when ready
  useEffect(() => {
    if (selectedRoomsInfo.filter(Boolean).length === requiredRooms && requiredRooms > 0) {
      if (buttonRef.current) {
        buttonRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setShake(true);
        const t = setTimeout(() => setShake(false), 2200);
        return () => clearTimeout(t);
      }
    }
  }, [selectedRoomsInfo, requiredRooms]);


  // proceed to booking
  // const proceedToBooking = () => {
    
  //   const query = {
  //     id: hotel.id,
  //     nights: hotel.nights,
  //     selectedRoom: JSON.stringify(selectedRoomsInfo.filter(Boolean)),

  //   };
  //   const qs = new URLSearchParams(query).toString();
  //   router.push(`/booking?${qs}`);
  // };

  return (
    <>
      <Header />
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
      
      <div className="hotel-view-container" style={{ padding: 12 }}>
        <h2 style={{ fontWeight: "bold", fontSize: 20 }}>Room Choice</h2>

        <p style={{ margin: "6px 0" }}>
          Select <strong>{requiredRooms}</strong> room{requiredRooms > 1 ? "s" : ""}.
          &nbsp;<span style={{ color: "#666" }}>{selectedRoomsInfo.filter(Boolean).length} / {requiredRooms} selected</span>
        </p>

        <RoomSelection rooms={hotel.rooms} currentRoomIndex={currentRoomIndex} onRoomClick={setCurrentRoomIndex} />

        {/* <HotelFilterBar onFilterChange={handleFilterChange} /> */}

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <p style={{textAlign:"center"}}>Loading rooms...</p>
          ) : filteredRooms && filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                hotel_id={hotel_id}
                room={room}
                nights={hotel.nights}
                roomCount={requiredRooms}
                onChooseRoom={(variation) => handleChooseRoom(room.id, variation)}
                isSelected={selectedRoomsInfo[currentRoomIndex]?.parentRoomId === room.id}
                selectedVariation={selectedRoomsInfo[currentRoomIndex]}
                isTaken={isTaken(room.id)}
              />
            ))
          ) : (
            <p className="no-rooms-msg">😔 No rooms are available for this selection.</p>
          )}
        </div>

        {/* {selectedRoomsInfo.filter(Boolean).length === requiredRooms && (
          <div style={{ textAlign: "right", marginTop: 12 }}>
            <button
              ref={buttonRef}
              className={`proceed-btn ${shake ? "shake" : ""}`}
              onClick={proceedToBooking}
              style={{
                padding: "12px 20px",
                backgroundColor: "#3c7dab",
                color: "white",
                borderRadius: 8,
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Proceed to Booking
            </button>
          </div>
        )} */}
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
}
