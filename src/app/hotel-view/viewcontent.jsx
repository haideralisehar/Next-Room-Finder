"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../hotel-view/hotel.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoLocationOutline } from "react-icons/io5";
import StarRating from "../components/rating";
import HotelTabs from "../components/tabs";
import ImageViewer from "../components/ImageViewer";
import RoomCard from "../components/RoomCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HotelFilterBar from "../components/RoomFilter";
import RoomSelection from "../components/ChooseRoom";
import Link from "next/link";

export default function HotelView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const buttonRef = useRef(null);

  const [shake, setShake] = useState(false);

  let hotelRooms = [];
  try {
    hotelRooms = searchParams.get("hotelRooms")
      ? JSON.parse(searchParams.get("hotelRooms"))
      : [];
  } catch (e) {
    console.error("Invalid hotelRooms data:", e);
  }

  const hotel = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    location: searchParams.get("location"),
    price: searchParams.get("price"),
    image: searchParams.get("image"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    lat: parseFloat(searchParams.get("lat")),
    lon: parseFloat(searchParams.get("lon")),
    rooms: searchParams.get("rooms")
      ? JSON.parse(searchParams.get("rooms"))
      : [],
    count: searchParams.get("count"),
    nights: searchParams.get("nights"),
    rating: searchParams.get("rating"),
    description: searchParams.get("description"),
    facilities: searchParams.get("facility")
      ? JSON.parse(searchParams.get("facility"))
      : [],
    roomImages: searchParams.get("roomImages")
      ? JSON.parse(searchParams.get("roomImages"))
      : [],
    totRooms: searchParams.get("totRooms")
      ? JSON.parse(searchParams.get("totRooms"))
      : [],
  };

  const [checkInDate, setCheckInDate] = useState(hotel.from);
  const [checkOutDate, setCheckOutDate] = useState(hotel.to);
  const [nights, setNights] = useState(hotel.nights);
  const [selectedRooms, setSelectedRooms] = useState(hotel.rooms);

  const [baseFilteredRooms, setBaseFilteredRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [selectedRoomsInfo, setSelectedRoomsInfo] = useState([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // ✅ Initial load
  useEffect(() => {
    if (hotelRooms.length > 0 && hotel.rooms.length > 0) {
      const firstRequested = hotel.rooms[0];
      const { adults = 1, children = 0 } = firstRequested;

      const matched = hotelRooms.filter(
        (room) =>
          Number(room.fitForAdults) === adults &&
          Number(room.fitForChildren) >= children
      );

      setBaseFilteredRooms(matched);
      setFilteredRooms(matched);

      toast.info(
        `${matched.length} room(s) available for Room 1 (${adults} adults, ${children} children)`,
        { autoClose: 3000 }
      );
    }
  }, [hotelRooms.length, hotel.rooms.length]);

  // ✅ When user clicks "Choose"
  const handleChooseRoom = (roomId, variation) => {
    const updated = [...selectedRoomsInfo];
    updated[currentRoomIndex] = { ...variation, parentRoomId: roomId };
    setSelectedRoomsInfo(updated);

    if (currentRoomIndex < selectedRooms.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
    }
  };

  // ✅ Filter logic
  const handleFilterChange = ({ roomType, refund, freeCancel, roomName }) => {
    if (!baseFilteredRooms || baseFilteredRooms.length === 0) {
      setFilteredRooms([]);
      return;
    }

    let filtered = [];
    baseFilteredRooms.forEach((room) => {
      let matchedVariations = room.variations.filter((variation) => {
        let isMatch = true;
        if (roomType) {
          isMatch =
            isMatch &&
            variation.mealPlan.toLowerCase().trim() ===
              roomType.toLowerCase().trim();
        }
        if (refund) {
          isMatch =
            isMatch &&
            (refund.toLowerCase() === "refundable"
              ? variation.refund === true
              : variation.refund === false);
        }
        if (freeCancel) {
          isMatch =
            isMatch &&
            (freeCancel.toLowerCase() === "free cancelation"
              ? variation.cancellation === true
              : variation.cancellation === false);
        }
        return isMatch;
      });

      if (matchedVariations.length > 0) {
        filtered.push({ ...room, variations: matchedVariations });
      }
    });

    if (roomName) {
      filtered = filtered.filter((room) =>
        room.title?.toLowerCase().includes(roomName.toLowerCase().trim())
      );
    }

    setFilteredRooms(filtered);

    if (filtered.length > 0) {
      toast.success(`${filtered.length} room(s) found`, { autoClose: 2000 });
    } else {
      toast.error("No rooms match your filters", { autoClose: 2000 });
    }
  };

  // ✅ Scroll to "Proceed" when all selected
  useEffect(() => {
    if (
      selectedRoomsInfo.length === selectedRooms.length &&
      selectedRooms.length > 0
    ) {
      if (buttonRef.current) {
        buttonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setShake(true);
        const timer = setTimeout(() => setShake(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedRoomsInfo, selectedRooms]);

  return (
    <>
      <Header />
      <div className="hotel-view-container">
        {/* <div className="RatingPlusTitle">
          <h1 className="hotel-title" style={{ padding: "0px 12px 0px 20px" }}>
            {hotel.name}
          </h1>
          <div className="StartManage">
            <StarRating rating={hotel.rating} />
          </div>
        </div>

        <div className="tit-mng" style={{ padding: "0px 12px 0px 20px" }}>
          <IoLocationOutline />
          <p>{hotel.location}</p>
        </div> */}

        {/* <ImageViewer images={hotel.roomImages} location={[hotel.lat, hotel.lon]} />
        <HotelTabs description={hotel.description} facility={hotel.facilities} /> */}

        <div style={{ marginTop: "10px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              padding: "1px 15px",
            }}
          >
            Room Choice
          </h2>

          <RoomSelection
            rooms={selectedRooms}
            currentRoomIndex={currentRoomIndex}
            onRoomClick={setCurrentRoomIndex}
          />

          <HotelFilterBar onFilterChange={handleFilterChange} />

          {filteredRooms.length > 0 ? (
  filteredRooms.map((room) => (
    <RoomCard
      key={room.id}
      room={room}
      nights={nights}
      roomCount={selectedRooms.length}
      onChooseRoom={(variation) => handleChooseRoom(room.id, variation)}
      isSelected={
        selectedRoomsInfo[currentRoomIndex]?.parentRoomId === room.id
      }
      selectedVariation={selectedRoomsInfo[currentRoomIndex]}
      isTaken={selectedRoomsInfo.some(
        (r, idx) => r?.parentRoomId === room.id && idx !== currentRoomIndex
      )} // ✅ prevent duplicate selection
    />
  ))
) : (
  <p className="no-rooms-msg">😔 No rooms are available for this selection.</p>
)}

        </div>

        {selectedRoomsInfo.filter(Boolean).length === selectedRooms.length && (
          <Link
            href={{
              pathname: "/booking",
              query: {
                id: hotel.id,
                name: hotel.name,
                location: hotel.location,
                price: hotel.price,
                image: hotel.image,
                from: checkInDate,
                to: checkOutDate,
                rooms: JSON.stringify(selectedRooms),
                totalRooms: selectedRooms.length,
                nights,
                rating: hotel.rating,
                selectedRoom: JSON.stringify(selectedRoomsInfo),
              },
            }}
          >
           <button
              style={{
                float: "right",
                marginTop: "8px",
                marginRight: "8px",

                padding: "12px 20px",
                backgroundColor: "#3c7dabff",
                color: "white",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              ref={buttonRef}
              className={`proceed-btn ${shake ? "shake" : ""}`}
            >
              Proceed to Booking
            </button>
            <br /><br />
          </Link>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
