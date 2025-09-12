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

export default function HotelView() {
  const searchParams = useSearchParams();

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

  const lastCountRef = useRef(null);
    const prevCountRef = useRef(null);

  // ✅ Initial load filter (exact room match anywhere in the list)
  useEffect(() => {
    if (hotelRooms.length > 0 && hotel.rooms.length > 0) {
      const matchedRooms = [];
      const availableRooms = [...hotelRooms];

      hotel.rooms.forEach((requested) => {
        const adults = Number(requested.adults ?? 1);
        const children = Number(requested.children ?? 0);

        const idx = availableRooms.findIndex(
          (room) =>
            Number(room.fitForAdults) === adults &&
            Number(room.fitForChildren) >= children
        );

        if (idx !== -1) {
          matchedRooms.push(availableRooms[idx]);
          availableRooms.splice(idx, 1);
        }
      });

      // ✅ Update state only if different
      setBaseFilteredRooms((prev) => {
        const same =
          prev.length === matchedRooms.length &&
          prev.every((r, i) => r.id === matchedRooms[i].id);
        return same ? prev : matchedRooms;
      });

      setFilteredRooms((prev) => {
        const same =
          prev.length === matchedRooms.length &&
          prev.every((r, i) => r.id === matchedRooms[i].id);
        return same ? prev : matchedRooms;
      });

      // ✅ Toast only if count changes
      if (prevCountRef.current !== matchedRooms.length) {
        if (matchedRooms.length > 0) {
          toast.success(`${matchedRooms.length} room(s) available`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("No rooms are available", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        prevCountRef.current = matchedRooms.length; // ✅ update ref
      }
    } else if (hotelRooms.length > 0) {
      setBaseFilteredRooms(hotelRooms);
      setFilteredRooms(hotelRooms);

      if (prevCountRef.current !== hotelRooms.length) {
        toast.success(`${hotelRooms.length} Room(s) Available`, {
          position: "top-right",
          autoClose: 3000,
        });
        prevCountRef.current = hotelRooms.length;
      }
    } else {
      if (prevCountRef.current !== 0) {
        toast.error("No rooms are available", {
          position: "top-right",
          autoClose: 3000,
        });
        prevCountRef.current = 0;
      }
    }
  }, [hotelRooms, hotel.rooms]);


  // ✅ Search handler (manual filtering)
  const handleSearchRooms = ({ from, to, rooms, nights }) => {
    setCheckInDate(from);
    setCheckOutDate(to);
    setNights(nights);
    setSelectedRooms(rooms);

    if (hotelRooms.length === 0) {
      setBaseFilteredRooms([]);
      setFilteredRooms([]);
      toast.error("No rooms available", { autoClose: 2000 });
      return;
    }

    const matchedRooms = [];

    rooms.forEach((requestedRoom) => {
      const { adults = 1, children = 0 } = requestedRoom;

      const available = hotelRooms.find(
        (room) =>
          room.fitForAdults >= adults &&
          room.fitForChildren >= children &&
          !matchedRooms.includes(room)
      );

      if (available) matchedRooms.push(available);
    });

    setBaseFilteredRooms(matchedRooms);
    setFilteredRooms(matchedRooms);

    if (matchedRooms.length > 0) {
      toast.success(`${matchedRooms.length} room(s) available`, {
        autoClose: 2000,
      });
    } else {
      toast.error("No rooms are available", { autoClose: 2000 });
    }
  };

  // ✅ Room filter handler
  const handleFilterChange = ({ roomType, refund, freeCancel, roomName }) => {
    if (!baseFilteredRooms || baseFilteredRooms.length === 0) {
      setFilteredRooms([]);
      return;
    }

    let filtered = [...baseFilteredRooms]; 

    if (roomType) {
      filtered = filtered.filter((room) => {
        if (roomType === "Room Only") return !room.breakFast;
        if (roomType === "Bed and Breakfast") return room.breakFast;
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

        <ImageViewer images={hotel.roomImages} />
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
              <p>
                😔 We’re sorry, no rooms are available based on your selected
                criteria! Please try adjusting your dates, room type, or applied
                filters to see more options, or consider selecting another hotel.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
}
