// "use client";
// import React from "react";
// import { useSelector } from "react-redux";
// import DownloadBtn from "../print/Voucher/DownloadBtn";
// import Header from "../components/Header";

// export default function Page() {
//   const booking = useSelector((state) => state.confirmedBooking.bookingData);

//    const details = booking?.booking?.Success?.BookingDetails?.Hotel;
//    const details1 = booking?.booking?.Success?.BookingDetails;
//    const customerRequest = booking?.booking?.Success?.BookingDetails?.CustomerRequest;


//   const checkIn = booking?.booking?.Success?.BookingDetails?.CheckInDate?.split(" ")[0];
//   const checkOut = booking?.booking?.Success?.BookingDetails?.CheckOutDate?.split(" ")[0];

//   console.log(checkIn, checkOut);

//   // -------------------------------
//   // Helper: get guest name by room
//   // -------------------------------
//   const getGuestNameByRoom = (roomNum) => {
//     const guestRoom = details1?.GuestList?.find(
//       (g) => g.RoomNum === roomNum
//     );

//     if (!guestRoom || !guestRoom.GuestInfo?.length) return "N/A";

//     return guestRoom.GuestInfo
//       .map(
//         (g) =>
//           `${g.Name?.First || ""} ${g.Name?.Last || ""}`.trim()
//       )
//       .join(", ");
//   };

//   // -------------------------------
//   // Helper: format adults + children
//   // -------------------------------
//   const formatGuestsCount = (adult, child) => {
//   const adultCount = Number(adult) || 0;
//   const childCount = Number(child) || 0;

//   const parts = [];

//   if (adultCount > 0) {
//     parts.push(`${adultCount} adult(s)`);
//   }

//   if (childCount > 0) {
//     parts.push(`${childCount} child(ren)`);
//   }

//   return parts.length ? parts.join(" + ") : "N/A";
// };


//   // -------------------------------
//   // Build voucher table rows
//   // -------------------------------
//   const tableRows =
//     details?.RatePlanList?.map((rate) => ({
//       roomType: rate.RatePlanName,
//       bedType: booking?.bedtpe || "N/A",
//       guestName: getGuestNameByRoom(
//         rate.RoomOccupancy?.RoomNum
//       ),
//       number: formatGuestsCount(
//         rate.RoomOccupancy?.AdultCount || "",
//         rate.RoomOccupancy?.ChildCount || ""
//       ),
//       mealType: booking?.mealType || "N/A",
//       roomNumber: rate.RoomOccupancy?.RoomNum,
//     })) || [];

    

//   return (
//     <>
//     <Header/>
    
//     <div style={{ background: "#f3f6fb" }}>
//       <DownloadBtn
//         booking={{
//           reference: booking?.booking?.Success?.BookingDetails?.BookingID,
//           agencyname: booking?.agency?.agencyName,
//           agencyphone: booking?.agency?.agencyPhoneNumber,
//           agencyaddress: booking?.agency?.agencyAddress,
//           agencyemail: booking?.agency?.agencyEmail,
//           cmerreq: customerRequest,
//           logo: booking?.agency?.logo,

//           hotelName: booking?.booking?.Success?.BookingDetails?.Hotel?.HotelName,
//           hotelAddress: booking?.address,
//           guestPhone: booking?.tel,

//           arrivalDate: checkIn,
//           departureDate: checkOut,

//           tableRows, // ✅ FINAL ROWS
//         }}
//       />


//     </div>
//     </>
//   );
// }

"use client";
import React from "react";
import { useSelector } from "react-redux";
import DownloadBtn from "../print/Voucher/DownloadBtn";
import Header from "../components/Header";

export default function Page() {
  const booking = useSelector((state) => state.confirmedBooking.bookingData);
console.log("Redux booking:", booking);
   const details = booking?.booking?.Success?.BookingDetails?.Hotel;
   const details1 = booking?.booking?.Success?.BookingDetails;
   const customerRequest = booking?.booking?.Success?.BookingDetails?.CustomerRequest;


  const checkIn = booking?.booking?.Success?.BookingDetails?.CheckInDate?.split(" ")[0];
  const checkOut = booking?.booking?.Success?.BookingDetails?.CheckOutDate?.split(" ")[0];

  console.log(checkIn, checkOut);

  // -------------------------------
  // Helper: get guest name by room
  // -------------------------------
  const getGuestNameByRoom = (roomNum) => {
    const guestRoom = details1?.GuestList?.find(
      (g) => g.RoomNum === roomNum
    );

    if (!guestRoom || !guestRoom.GuestInfo?.length) return "N/A";

    return guestRoom.GuestInfo
      .map(
        (g) =>
          `${g.Name?.First || ""} ${g.Name?.Last || ""}`.trim()
      )
      .join(", ");
  };

  // -------------------------------
  // Helper: format adults + children
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
    details?.RatePlanList?.map((rate) => ({
      roomType: rate.RatePlanName,
      bedType: booking?.bedtpe || "N/A",
      guestName: getGuestNameByRoom(
        rate.RoomOccupancy?.RoomNum
      ),
      number: formatGuestsCount(
        rate.RoomOccupancy?.AdultCount || "",
        rate.RoomOccupancy?.ChildCount || ""
      ),
      mealType: booking?.mealType || "N/A",
      roomNumber: rate.RoomOccupancy?.RoomNum,
    })) || [];

    

  return (
    <>
    <Header/>
    <p>Hello</p>
    <div style={{ background: "#f3f6fb" }}>
      <DownloadBtn
        booking={{
          reference: booking?.booking?.Success?.BookingDetails?.BookingID,
          agencyname: booking?.agency?.agencyName,
          agencyphone: booking?.agency?.agencyPhoneNumber,
          agencyaddress: booking?.agency?.agencyAddress,
          agencyemail: booking?.agency?.agencyEmail,
          cmerreq: customerRequest,

          hotelName: booking?.booking?.Success?.BookingDetails?.Hotel?.HotelName,
          hotelAddress: booking?.address,
          guestPhone: booking?.tel,

          arrivalDate: checkIn,
          departureDate: checkOut,

          tableRows, // ✅ FINAL ROWS
        }}
      />


    </div>
    </>
  );
}
