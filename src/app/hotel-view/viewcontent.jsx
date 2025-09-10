"use client";
import React, { useEffect, useState } from "react";
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
        (room) => room.fitForAdults >= adults && room.fitForChildren >= children
      );

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

  // ✅ Filter rooms & update dates/nights when search bar is used
  const handleSearchRooms = ({ from, to, rooms, nights }) => {
    setCheckInDate(from);
    setCheckOutDate(to);
    setNights(nights);
    setSelectedRooms(rooms);

    const { adults = 1, children = 0 } = rooms[0] || {};
    const filtered = hotelRooms.filter(
      (room) => room.fitForAdults >= adults && room.fitForChildren >= children
    );

    setFilteredRooms(filtered);

    if (filtered.length > 0) {
      toast.success(`${filtered.length} ${filtered.length >2? "Rooms Available": "Rooms Available"}`, {
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
        <HotelTabs description={hotel.description} facility={hotel.facilities} />

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

          <HotelSearchBar
            showDestination={false}
            initialCheckIn={checkInDate}
            initialCheckOut={checkOutDate}
            initialRooms={selectedRooms}
            onSearch={handleSearchRooms}
          />

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights} // ✅ Now uses latest nights
                roomCount={filteredRooms.length}
                id = {hotel.id}
                name = {hotel.name}
                location = {hotel.location}
                price = {hotel.price} 
                image = {hotel.image}
                from = {checkInDate} 
                to = {checkOutDate}
                rooms = {JSON.stringify(selectedRooms)} 
                count = {hotel.count}
                rating = {hotel.rating}

              />
            ))
          ) : (
            <p>No rooms available for this hotel.</p>
          )}
        </div>

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
              count: hotel.count,
              nights: nights, // ✅ Pass updated nights
              rating: hotel.rating,
            },
          }}
        >
          <button className="confirm-btn">Proceed to Booking</button>
        </Link>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
}
