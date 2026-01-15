"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import { decryptBookingObject } from "../api/utils/voucherdta";
import DownloadBtn from "../print/Voucher/DownloadBtn";
import Image from "next/image";
import Header from "../components/Header";

export default function VoucherPage() {
    
  const params = useSearchParams();
  const safe = params.get("voucher");

  const encrypted = decodeURIComponent(safe);
  const booking = decryptBookingObject(encrypted);

  const [isShows, setisShows] = useState(true);

 if (!booking) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      Invalid or expired voucher
    </div>
  );
}


  console.log("data", booking);

  const details1 = booking?.hDetail;
  const details =
    booking?.hotelDet;
  const CustomerRequest =
    booking?.booking?.data?.fullResponse?.Success?.BookingDetails
      ?.CustomerRequest;

  const getGuestNameByRoom = (roomNum) => {
    const guestRoom = details1?.find((g) => g.RoomNum === roomNum);

    if (!guestRoom || !guestRoom.GuestInfo?.length) return "N/A";

    return guestRoom.GuestInfo.map((g) =>
      `${g.Name?.First || ""} ${g.Name?.Last || ""}`.trim()
    ).join(", ");
  };

  // -------------------------------
  // Helper: format adults + children..
  // -------------------------------
  const formatGuestsCount = (adult, child) => {
    const adultCount = Number(adult) || 0;
    const childCount = Number(child) || 0;

    const parts = [];

    if (adultCount > 0) {
      parts.push(`${adultCount} adult(s)`);
    }

    if (childCount > 0) {
      parts.push(`${childCount} child(ren)`);
    }

    return parts.length ? parts.join(" + ") : "N/A";
  };

  // -------------------------------
  // Build voucher table rows
  // -------------------------------
  const tableRows =
    details?.map((rate) => ({
      roomType: rate.RatePlanName,
      bedType: booking?.bType || "N/A",
      guestName: getGuestNameByRoom(rate.RoomOccupancy?.RoomNum),
      number: formatGuestsCount(
        rate.RoomOccupancy?.AdultCount || "",
        rate.RoomOccupancy?.ChildCount || ""
      ),
      mealType: booking?.mType || "N/A",
      roomNumber: rate.RoomOccupancy?.RoomNum,
    })) || [];

  return (
    <>
    <Header/>
     <div style={{ background: "#f3f6fb", minHeight: "100vh" }}>
                  <DownloadBtn
                    booking={{
                      price: booking?.price,
                      agencyIds: booking?.agencys,
                      isShow: booking?.isShow,
                      reference: booking?.reference,
                      searchId: booking?.searchId,
                      agencyname:
                        booking?.agencyname,
                      agencyphone:
                        booking?.agencyphone,
                      agencyaddress:
                        booking?.agencyaddress,
                      agencyemail:
                        booking?.agencyemail,
                      logo: booking?.logo,
    
                      hotelName:
                        booking?.hotelName,
    
                      BookingID:
                        booking?.BookingID,
                      hotelAddress: booking?.hotelAddress,
                      guestPhone: booking?.guestPhone,
    
                      cmerreq: booking?.CustomerRequest || "",
    
                      arrivalDate:
                        booking?.arrivalDate,
                      departureDate:
                        booking?.departureDate,
                      tableRows: booking?.tableRows || tableRows,
    
                      // tableRows: booking?.data?.fullResponse?.Success?.BookingDetails,
                    }}
                    
                  />
                </div>
    </>
  );
}
