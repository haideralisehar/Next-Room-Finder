"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "../hotel-view/hotel.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoLocationOutline } from "react-icons/io5";
import Link from "next/link";
import StarRating from "../components/rating";
import HotelTabs from "../components/tabs";
import "../styling/ImageViewer.css";
import ImageViewer from "../components/ImageViewer";
import RoomCard from "../components/RoomCard";
import HotelSearchBar from "../components/RoomSearch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFrown } from "react-icons/fa";

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

  // ✅ States that will be updated when user searches again
  const [checkInDate, setCheckInDate] = useState(hotel.from);
  const [checkOutDate, setCheckOutDate] = useState(hotel.to);
  const [nights, setNights] = useState(hotel.nights);
  const [selectedRooms, setSelectedRooms] = useState(hotel.rooms);
  const [filteredRooms, setFilteredRooms] = useState(hotelRooms);

  // ✅ Auto filter when page loads
  useEffect(() => {
    if (hotelRooms.length > 0 && hotel.rooms.length > 0) {
      const { adults = 1, children = 0 } = hotel.rooms[0];
      const filtered = hotelRooms.filter(
        (room) => room.fitForAdults == adults && room.fitForChildren >= children
      );

      //i updated here >= to ==

      setFilteredRooms(filtered);

      if (filtered.length > 0) {
        toast.success(`${filtered.length} room(s) available`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("No rooms are available", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else if (hotelRooms.length > 0) {
      setFilteredRooms(hotelRooms);
      toast.success(`${hotelRooms.length} Room(s) Available`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error("No rooms are available", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

  const handleSearchRooms = ({ from, to, rooms, nights }) => {
  setCheckInDate(from);
  setCheckOutDate(to);
  setNights(nights);
  setSelectedRooms(rooms);

  const requestedRoomCount = rooms.length;

  // 🚨 Check if hotel has enough rooms
  if (hotelRooms.length < requestedRoomCount) {
    setFilteredRooms([]); // no available rooms
    toast.error(`Only ${hotelRooms.length} room(s) available, but you requested ${requestedRoomCount}`, {
      position: "top-right",
      autoClose: 2000,
    });
    return;
  }

  // ✅ Continue filtering by capacity
  const { adults = 1, children = 0 } = rooms[0] || {};
  const filtered = hotelRooms.filter(
    (room) => room.fitForAdults >= adults && room.fitForChildren >= children
  );

  setFilteredRooms(filtered);

  if (filtered.length > 0) {
    toast.success(`${filtered.length} room(s) available`, {
      position: "top-right",
      autoClose: 2000,
    });
  } else {
    toast.error("No rooms are available", {
      position: "top-right",
      autoClose: 2000,
    });
  }
};


  return (
    <>
      <Header />

      <div className="hotel-view-container">
        <div className="RatingPlusTitle">
          <h1 className="hotel-title" style={{ padding: "0px 12px 0px 0px" }}>
            {hotel.name}
          </h1>
          <div className="StartManage">
            <StarRating rating={hotel.rating} />
          </div>
        </div>

        <div className="tit-mng">
          <IoLocationOutline />
          <p>{hotel.location}</p>
        </div>

        <ImageViewer images={hotel.roomImages} />
        <HotelTabs
          description={hotel.description}
          facility={hotel.facilities}
        />

        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              paddingBottom: "10px",
            }}
          >
            Choose Room
          </h2>

          {/* <HotelSearchBar
            showDestination={false}
            initialCheckIn={checkInDate}
            initialCheckOut={checkOutDate}
            rooms={selectedRooms} // ✅ controlled rooms
            onRoomsChange={setSelectedRooms} // ✅ keep in sync
            onSearch={handleSearchRooms}
          /> */}

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights} // ✅ Now uses latest nights
                roomCount={selectedRooms.length}
                id={hotel.id}
                name={hotel.name}
                location={hotel.location}
                price={hotel.price}
                image={hotel.image}
                from={checkInDate}
                to={checkOutDate}
                // rooms={JSON.stringify(selectedRooms)}
                rooms={selectedRooms}
                count={hotel.count}
                rating={hotel.rating}
              />
            ))
          ) : (
            <div style={{ fontSize: "20px", color: "#ec4141ff", display:"flex", padding:"15px" }}>
 <p style={{paddingTop:"-10px"}}>😔 We’re sorry, no rooms are available based on your selected criteria!
Please try adjusting your dates, room type, or applied filters to see more options, or consider selecting another hotel.</p>
    </div>
          )}
        </div>
      </div>
      

      <Footer />
      <ToastContainer />
    </>
  );
}


