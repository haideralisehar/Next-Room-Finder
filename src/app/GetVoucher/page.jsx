// app/page.js
"use client"
import React from "react";
import DownloadBtn from "../print/Voucher/DownloadBtn";

import { useSelector } from "react-redux";




export default function Page() {
  const booking = useSelector((state) => state.confirmedBooking.bookingData);

  const checkIn = booking?.booking?.Success?.BookingDetails?.CheckInDate?.split(" ")[0];
  const checkOut = booking?.booking?.Success?.BookingDetails?.CheckOutDate?.split(" ")[0];
  return (
    <div style={{ background: "#f3f6fb", minHeight: "100vh"}}>
      <DownloadBtn
        booking={{
          reference: booking?.booking?.Success?.BookingDetails?.BookingID,
          agencyname: booking?.agency?.data?.agencyName,
          agencyphone: booking?.agency?.data?.agencyPhoneNumber,
          agencyaddress: booking?.agency?.data?.agencyAddress,
          agencyemail: booking?.agency?.data?.agencyEmail,
          guestName: ["Jalal Saleh", "Jalal Saleh"],
          guestEmail: "jalal@example.com",
          guestPhone: booking?.tel,
          hotelName: booking?.booking?.Success?.BookingDetails?.Hotel?.HotelName,
          hotelAddress: booking?.address,
          totalAmount: "120 BHD",
          arrivalDate: checkIn,
          departureDate: checkOut,
          roomType: ["Cocoon 2 / 1 Double Bed", "1 Double Bed"],
          guests: ["1", "2"],
          mealType: ["Room Only", "All Inclusive"],
        }}
      />
    </div>
  );
}
