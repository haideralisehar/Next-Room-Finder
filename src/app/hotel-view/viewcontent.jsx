"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "../hotel-view/hotel.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoLocationOutline } from "react-icons/io5";
import StarRating from "../components/rating";
import HotelTabs from "../components/tabs";
import "../styling/ImageViewer.css";
import ImageViewer from "../components/ImageViewer";
import RoomCard from "../components/RoomCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HotelFilterBar from "../components/RoomFilter";
import RoomSelection from "../components/ChooseRoom";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HotelView() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat"));
  const lon = parseFloat(searchParams.get("lon"));

  const position = [lat, lon];
   // pass to ImageViewer
  const router = useRouter();

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
    lat :parseFloat(searchParams.get("lat")),
   lon : parseFloat(searchParams.get("lon")),
    
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
  
 

  const buttonRef = useRef(null);
  const [shake, setShake] = useState(false);

  const [checkInDate, setCheckInDate] = useState(hotel.from);
  const [checkOutDate, setCheckOutDate] = useState(hotel.to);
  const [nights, setNights] = useState(hotel.nights);
  const [selectedRooms, setSelectedRooms] = useState(hotel.rooms);

  const [baseFilteredRooms, setBaseFilteredRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [selectedRoomsInfo, setSelectedRoomsInfo] = useState([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // ✅ Show rooms only for the first room on initial load
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

  // ✅ Let user click a room card to change active index
const handleRoomClick = (index) => {
  setCurrentRoomIndex(index);

  const chosenIds = selectedRoomsInfo.filter(Boolean).map((r) => r.id);
  const { adults = 1, children = 0 } = selectedRooms[index];

  const matched = hotelRooms.filter(
    (room) =>
      Number(room.fitForAdults) === adults &&
      Number(room.fitForChildren) >= children &&
      (!chosenIds.includes(room.id) || selectedRoomsInfo[index]?.id === room.id) 
      // ✅ allow current room's choice to still be visible
  );

  setBaseFilteredRooms(matched);
  setFilteredRooms(matched);

  toast.info(
    `${matched.length} room(s) available for Room ${index + 1} (${adults} adults, ${children} children)`,
    { autoClose: 3000 }
  );
};

  // ✅ When user chooses a room -> move to next index
  const handleChooseRoom = (roomData) => {
  const updated = [...selectedRoomsInfo];
  updated[currentRoomIndex] = roomData;
  setSelectedRoomsInfo(updated);

  const chosenIds = updated.filter(Boolean).map((r) => r.id);

  if (currentRoomIndex < selectedRooms.length - 1) {
    const nextIndex = currentRoomIndex + 1;
    setCurrentRoomIndex(nextIndex);

    const nextRequested = selectedRooms[nextIndex];
    const { adults = 1, children = 0 } = nextRequested;

    // const matched = hotelRooms.filter(
    //   (room) =>
    //     Number(room.fitForAdults) === adults &&
    //     Number(room.fitForChildren) >= children &&
    //     !chosenIds.includes(room.id) 
    // );

    // remove strict exclusion of chosen rooms
const matched = hotelRooms.filter(
  (room) =>
    Number(room.fitForAdults) === adults &&
    Number(room.fitForChildren) >= children
);


    setBaseFilteredRooms(matched);
    setFilteredRooms(matched);

    toast.info(
      `${matched.length} room(s) available for Room ${nextIndex + 1} (${adults} adults, ${children} children)`,
      { autoClose: 3000 }
    );
  }
};


  // ✅ Optional filter bar for the current room’s available list
  const handleFilterChange = ({ roomType, refund, freeCancel, roomName }) => {
    if (!baseFilteredRooms || baseFilteredRooms.length === 0) {
      setFilteredRooms([]);
      return;
    }

    let filtered = [...baseFilteredRooms];

    if (roomType) {
      filtered = filtered.filter((room) => {
        if (roomType === "Room Only") return room.mealPlan === "Room Only";
        if (roomType === "Bed and Breakfast") return room.mealPlan === "Bed and Breakfast";
        if (roomType === "Half Board") return room.mealPlan === "Half Board";
        if (roomType === "Full Board") return room.mealPlan === "Full Board";
        return true;
      });
    }

    if (refund) {
      filtered = filtered.filter((room) =>
        refund === "Refundable" ? room.refund === true : room.refund === false
      );
    }

    if (freeCancel) {
      filtered = filtered.filter((room) =>
        freeCancel === "Free Cancelation"
          ? room.Cancelation === true
          : room.Cancelation === false
      );
    }

    if (roomName) {
      filtered = filtered.filter((room) =>
        room.title.toLowerCase().includes(roomName.toLowerCase())
      );
    }

    setFilteredRooms(filtered);

    if (filtered.length > 0) {
      toast.success(`${filtered.length} room(s) found`, { autoClose: 2000 });
    } else {
      toast.error("No rooms match your filters", { autoClose: 2000 });
    }
  };

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
        <div className="RatingPlusTitle">
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
        </div>

        <ImageViewer images={hotel.roomImages} location={[hotel.lat, hotel.lon]}  />
        <HotelTabs description={hotel.description} facility={hotel.facilities} />

        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              padding: "15px 15px",
            }}
          >
            Room Choice
          </h2>

          <RoomSelection
            rooms={selectedRooms}
            currentRoomIndex={currentRoomIndex}
            onRoomClick={handleRoomClick}
          />

          <HotelFilterBar onFilterChange={handleFilterChange} />

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
  key={room.id}
  room={room}
  nights={nights}
  roomCount={selectedRooms.length}
  id={hotel.id}
  name={hotel.name}
  location={hotel.location}
  price={hotel.price}
  image={hotel.image}
  from={checkInDate}
  to={checkOutDate}
  rooms={selectedRooms}
  count={hotel.count}
  rating={hotel.rating}
  selectedRoom={selectedRoomsInfo}
  selectedRooms={selectedRooms}
  onChooseRoom={() => handleChooseRoom(room)}
  isSelected={selectedRoomsInfo[currentRoomIndex]?.id === room.id}
  isTaken={
    selectedRoomsInfo.some(
      (r, idx) => r?.id === room.id && idx !== currentRoomIndex
    )
  } // ✅ mark if already selected by another slot
/>

            ))
          ) : (
            <div
              style={{
                fontSize: "20px",
                color: "#ec4141ff",
                display: "flex",
                padding: "15px 5px 15px 5px",
              }}
            >
              <p style={{ padding: "5px 10px" }}>
                😔 No rooms are available for this selection. Try changing your
                filters or dates.
              </p>
            </div>
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
              float:"right",
              marginTop: "8px",
              marginRight:"8px",

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
          <br />
          <br />
        </Link>
        
      )}
      
      </div>

      

      <Footer />
      <ToastContainer />
    </>
  );
}
