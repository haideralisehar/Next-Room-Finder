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

export default function HotelView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const buttonRef = useRef(null);

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

  // --- useEffect: merge price_info + room_info into grouped rooms with variations
  useEffect(() => {
    const s_hotel = sessionStorage.getItem("selectedHotel");
    if (!s_hotel) {
      console.error("No rooms data found in sessionStorage.selectedHotel");
      setLoading(false);
      return;
    }

    try {
      const apiResponse = JSON.parse(s_hotel);

      const price_info = apiResponse.priceInfo?.RatePlanList || [];
      const room_info = apiResponse.rooms || [];

      // map rooms by id
      const roomMap = new Map((room_info || []).map((r) => [Number(r.id ?? r.RoomTypeID ?? r.RoomTypeId), r]));

      // group by RoomTypeID
      const grouped = new Map();

      (price_info || []).forEach((plan) => {
        const roomTypeId = Number(plan.RoomTypeID ?? plan.RoomTypeId ?? plan.RoomType) || null;
        const roomDetail = roomMap.get(roomTypeId) || plan.roomDetails || null;

        // price extraction: prefer PriceList[0].Price, fallback to Prices[0].Price.Amount or TotalPrice
        const priceFromList =
          plan?.PriceList?.[0]?.Price ??
          plan?.Prices?.[0]?.Price?.Amount ??
          plan?.TotalPrice ??
          plan?.displayPrice ??
          0;

        // currency
        const currency = plan?.Currency ?? plan?.Prices?.[0]?.Currency ?? "USD";

        // meal extraction: prefer PriceList[0].MealType, fallback BreakfastType or plan.mealType
        const mealType = plan?.PriceList?.[0]?.MealType ?? plan?.Prices?.[0]?.MealType ?? plan?.BreakfastType ?? plan?.mealType ?? "N/A";
        const mealAmount = plan?.PriceList?.[0]?.MealAmount ?? plan?.Prices?.[0]?.MealAmount ?? undefined;

        // refund/cancellation heuristics
        const refundable = Array.isArray(plan?.RatePlanCancellationPolicyList) && plan.RatePlanCancellationPolicyList.length > 0;
        const cancellation = Array.isArray(plan?.RatePlanCancellationPolicyList) && plan.RatePlanCancellationPolicyList.length > 0;

        const variation = {
          ratePlanId: plan?.RatePlanID ?? plan?.RatePlanId ?? `${roomTypeId}_${Math.random().toString(36).slice(2,8)}`,
          ratePlanName: plan?.RatePlanName ?? plan?.RoomName ?? "Rate Plan",
          price: Number(priceFromList) || 0,
          currency,
          mealType,
          mealAmount,
          refundable,
          cancellation,
          raw: plan,
        };

        const roomKey = roomTypeId ?? (roomDetail?.id ?? variation.ratePlanId);

        if (!grouped.has(roomKey)) {
          // derive facilities from roomDetail
          const facilities = [];
          if (roomDetail) {
            if (roomDetail.hasWifi) facilities.push("Free WiFi");
            if (roomDetail.hasWindow) facilities.push("Window");
            if (roomDetail.size) facilities.push(`Size: ${roomDetail.size}`);
          }

          grouped.set(roomKey, {
            id: roomKey,
            roomTypeId: roomKey,
            title: roomDetail?.name ?? plan?.RoomName ?? plan?.RatePlanName ?? "Room",
            roomDetails: roomDetail,
            fitForAdults: roomDetail?.maxOccupancy ?? roomDetail?.StandardOccupancy ?? plan?.RoomOccupancy?.AdultCount ?? 1,
            fitForChildren: roomDetail?.ChildCount ?? plan?.RoomOccupancy?.ChildCount ?? 0,
            facilities,
            variations: [variation],
          });
        } else {
          grouped.get(roomKey).variations.push(variation);
        }
      });

      const mergedArray = Array.from(grouped.values());

      // fallback: if none grouped but room_info present, use rooms
      if (mergedArray.length === 0 && Array.isArray(room_info) && room_info.length > 0) {
        const fallback = room_info.map((r) => ({
          id: r.id,
          roomTypeId: r.id,
          title: r.name ?? r.RoomName ?? "Room",
          roomDetails: r,
          fitForAdults: r.maxOccupancy ?? r.StandardOccupancy ?? 1,
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
      toast.info(`${(mergedArray.length || room_info.length)} room(s) available`, { autoClose: 1500 });
      console.log("Merged grouped rooms:", mergedArray);
    } catch (err) {
      console.error("Failed to parse selectedHotel:", err);
      setLoading(false);
      toast.error("Failed to load room data", { autoClose: 2000 });
    }
  }, []);

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
  const handleChooseRoom = (parentRoomId, variation) => {
    const updated = [...selectedRoomsInfo];
    updated[currentRoomIndex] = { ...variation, parentRoomId };
    setSelectedRoomsInfo(updated);

    // auto-advance to next slot if available
    if (currentRoomIndex < requiredRooms - 1) {
      setCurrentRoomIndex((p) => p + 1);
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
  const proceedToBooking = () => {
    const query = {
      id: hotel.id,
      nights: hotel.nights,
      selectedRoom: JSON.stringify(selectedRoomsInfo.filter(Boolean)),
    };
    const qs = new URLSearchParams(query).toString();
    router.push(`/booking?${qs}`);
  };

  return (
    <>
      <Header />
      <div className="hotel-view-container" style={{ padding: 12 }}>
        <h2 style={{ fontWeight: "bold", fontSize: 20 }}>Room Choice</h2>

        <p style={{ margin: "6px 0" }}>
          Select <strong>{requiredRooms}</strong> room{requiredRooms > 1 ? "s" : ""}.
          &nbsp;<span style={{ color: "#666" }}>{selectedRoomsInfo.filter(Boolean).length} / {requiredRooms} selected</span>
        </p>

        <RoomSelection rooms={hotel.rooms} currentRoomIndex={currentRoomIndex} onRoomClick={setCurrentRoomIndex} />

        <HotelFilterBar onFilterChange={handleFilterChange} />

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <p>Loading rooms...</p>
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

        {selectedRoomsInfo.filter(Boolean).length === requiredRooms && (
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
        )}
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
}
