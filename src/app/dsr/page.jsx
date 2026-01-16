// "use client";
// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../styling/DSRPage.css";
// import Header from "../components/Header";
// import Image from "next/image";

// const TABLE_COLUMNS = [
//   "Booking ID",
//   "Action",
//   "Agency",
//   "Price",
//   "Booking Date",
//    "Status",

// ];

// export default function DSRPage() {
//   const [filters, setFilters] = useState({
//     agency: "",
//     status: "",
//     currency: "",
//   });

//   const [dsrData, setDsrData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [agencyOptions, setAgencyOptions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;

//   const [visibleCount, setVisibleCount] = useState(5);
//   const [openActionId, setOpenActionId] = useState(null);

//   /* =========================
//      Fetch API Data
//   ========================= */
//   useEffect(() => {
//     const fetchDSRData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/dsrdata");
//         const json = await res.json();

//         if (json.success) {
//           const formatted = json.data.map((item) => ({
//             ...item,
//             date: new Date(item.bookingDate),
//           }));

//           setDsrData(formatted);
//           setFilteredData(formatted);

//           // 🔹 Extract unique agencies dynamically
//           const agencies = [
//             ...new Set(formatted.map((i) => i.agency).filter(Boolean)),
//           ];
//           setAgencyOptions(agencies);
//         }
//       } catch (err) {
//         console.error("Failed to load DSR data", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDSRData();
//   }, []);

//   /* =========================
//      Close dropdown on outside click
//   ========================= */
//   useEffect(() => {
//     const close = () => setOpenActionId(null);
//     window.addEventListener("click", close);
//     return () => window.removeEventListener("click", close);
//   }, []);

//   /* =========================
//      Filters
//   ========================= */
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((p) => ({ ...p, [name]: value }));
//   };

//   const handleSearch = () => {
//     let data = [...dsrData];

//     data = data.filter((item) => {
//       if (filters.agency && item.agency !== filters.agency) return false;
//       if (filters.status && item.status !== filters.status) return false;
//       if (filters.currency && item.currency !== filters.currency) return false;

//       if (startDate && endDate) {
//         if (item.date < startDate || item.date > endDate) return false;
//       }
//       return true;
//     });

//     setFilteredData(data);
//     setVisibleCount(100);
//   };

//   const handleReset = () => {
//     setFilters({ agency: "", status: "", currency: "" });
//     setDateRange([null, null]);
//     setFilteredData(dsrData);
//     setVisibleCount(100);

//     document.querySelectorAll("select").forEach((s) => (s.value = ""));
//   };

//   /* =========================
//      Load More
//   ========================= */
//   const handleLoadMore = () => {
//     setVisibleCount((prev) => prev + 50);
//   };

//   const currentItems = filteredData.slice(0, visibleCount);

//   /* =========================
//      Actions
//   ========================= */
//   const handleView = (id) => {
//     setOpenActionId(null);
//     alert(`View ${id}`);
//   };

//   const handleCancel = (id) => {
//     setOpenActionId(null);
//     alert(`Cancel ${id}`);
//   };

//   const handleSettlement = (id) => {
//     setOpenActionId(null);
//     alert(`Settlement ${id}`);
//   };

//   /* =========================
//      Helpers
//   ========================= */
//   const renderStatus = (status) => (
//     <span className={`status-badge ${status?.toLowerCase()}`}>
//       {status}
//     </span>
//   );

//   return (
//     <>
//       <Header />

//       {loading && (
//                     <div className="loading-container">
//                       <div className="box">
//                         <Image
//                           className="circular-left-right"
//                           src="/loading_ico.png"
//                           alt="Loading"
//                           width={200}
//                           height={200}
//                         />
//                         <p style={{ fontSize: "13px" }}>Please Wait...</p>
//                       </div>
//                     </div>
//                   )}

//       <div className="dsr-container">
//         {/* ================= Filters ================= */}
//         <div className="filter-section">
//           <div className="filter-item">
//             <label>Agency</label>
//             <select name="agency" onChange={handleFilterChange}>
//               <option value="">All</option>
//               {agencyOptions.map((a) => (
//                 <option key={a} value={a}>
//                   {a}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="filter-item">
//             <label>Status</label>
//             <select name="status" onChange={handleFilterChange}>
//               <option value="">All</option>
//               <option value="Paid">Paid</option>
//               <option value="FAILED">FAILED</option>
//             </select>
//           </div>

//           <div className="filter-item">
//             <label>Booking Date</label>
//             <DatePicker
//               selectsRange
//               startDate={startDate}
//               endDate={endDate}
//               onChange={(update) => setDateRange(update)}
//               className="date-picker"
//             />
//           </div>

//           <div className="filter-item">
//             <label>Currency</label>
//             <select name="currency" onChange={handleFilterChange}>
//               <option value="">All</option>
//               <option value="BHD">BHD</option>
//             </select>
//           </div>

//           <div className="action-buttons">
//             <button className="search-btn" onClick={handleSearch}>
//               SEARCH
//             </button>
//             <button className="reset-btn" onClick={handleReset}>
//               RESET
//             </button>
//           </div>
//         </div>

//         {/* ================= Results ================= */}
//         {loading ? (
//           <p className="no-records"></p>
//         ) : currentItems.length > 0 ? (
//           <>
//             <div className="rprt-rslt">
//               Showing {currentItems.length} of {filteredData.length} Result(s)
//             </div>

//             <div className="result-section">
//               <table>
//                 <thead>
//                   <tr>
//                     {TABLE_COLUMNS.map((c) => (
//                       <th key={c}>{c}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.id}</td>
//                        <td className="action-cell">
//                         <span
//                           className="action-icon"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setOpenActionId(
//                               openActionId === item.id ? null : item.id
//                             );
//                           }}
//                         >
//                           ⋮
//                         </span>

//                         {openActionId === item.id && (
//                           <div
//                             className="action-dropdown"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <div onClick={() => handleView(item.id)}>View</div>
//                             <div onClick={() => handleCancel(item.id)}>
//                               Cancel
//                             </div>
//                             <div onClick={() => handleSettlement(item.id)}>
//                               Settlement
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                       <td>{item.agency}</td>
//                        <td>{item.price.toFixed(2)}</td>
//                       <td>{item.date.toLocaleDateString()}</td>
//                       <td>{renderStatus(item.status)}</td>

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {currentItems.length < filteredData.length && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                   <button className="search-btn" onClick={handleLoadMore}>
//                     Load More
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <p className="no-records">No records found.</p>
//         )}
//       </div>
//     </>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import "../bookingPage/mybooking.css";
import Header from "../components/Header";
import Cookies from "js-cookie";
import Image from "next/image";
import DownloadBtn from "../print/Voucher/DownloadBtn";
import { encryptBookingObject } from "../api/utils/voucherdta";

export default function MyBookingsPage() {
  const [filters, setFilters] = useState({
    bookingId: "",
    reservationStatus: "",
    serviceType: "All",
    leaderName: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const agencyId = Cookies.get("agencyId");

  const [open, setOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelModalview, setShowCancelModalview] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loadingfetch, setLoadingfetch] = useState(false);
  const [viewBookingData, setViewBookingData] = useState(null);
  const [refundAmounts, setrefundAmounts] = useState(null);
  const [permissions, setPermissions] = useState(null);

  const recordsPerPage = 10;

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000); // ⏱ checks every second (use 60000 for 1 min)

    return () => clearInterval(timer);
  }, []);
  const targetTime = new Date("1/10/2026, 3:35:41 AM");
  const isHidden = now > targetTime;

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch("/api/utils")
      .then((res) => res.json())
      .then((data) => {
        setPermissions(data.permissions);
      });
  }, []);

  // 🔹 Fetch + Filter bookings
  const handleSearch = async () => {
    try {
      setLoading(true);

      // const agencyId = "58499949-0de8-4c41-a313-478679ce2faa"; // make dynamic later
      const hold = "paid";

      const res = await fetch(
        `/api/myBookings?agencyId=${agencyId}&paymentstatus=${hold}`
      );
      const json = await res.json();

      if (!json.success) {
        setResults([]);
        return;
      }

      console.log(json);

      const filtered = json.data.filter((b) => {
        return (
          (!filters.bookingId ||
            b.id.toLowerCase().includes(filters.bookingId.toLowerCase())) &&
          (!filters.leaderName ||
            b.leader
              .toLowerCase()
              .includes(filters.leaderName.toLowerCase())) &&
          (!filters.reservationStatus ||
            b.status === filters.reservationStatus) &&
          (filters.serviceType === "All" || b.service === filters.serviceType)
        );
      });

      setResults(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset filters
  const handleReset = () => {
    setFilters({
      bookingId: "",
      reservationStatus: "",
      serviceType: "All",
      leaderName: "",
    });
    setResults([]);
    setCurrentPage(1);
  };

  // 🔹 Enter key search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filters]);

  // 🔹 Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = results.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(results.length / recordsPerPage);

  const scrollToResultsTop = () => {
    const el = document.querySelector(".buttons");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      scrollToResultsTop();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      scrollToResultsTop();
    }
  };

  function getFinalRefund(
    refundAmount,
    activeVoid,
    voidFee,
    voidType,
    voidserviceResponse
  ) {
    if (!activeVoid) return refundAmount;

    if (
      !Array.isArray(voidserviceResponse) ||
      voidserviceResponse.length === 0
    ) {
      return refundAmount;
    }

    if (!voidFee || !voidType) return refundAmount;

    if (voidType === "Amount") {
      return refundAmount - voidFee;
    }

    if (voidType === "Percentage") {
      return refundAmount - (refundAmount * voidFee) / 100;
    }

    return refundAmount;
  }

  /* =========================
     Actions
  ========================= */
  // const handleView = (booking, price) => {
  //   setOpenActionId(null);
  //   setViewBookingData(booking);
  //   setShowCancelModalview(true);
  // };

  // const handleCancel = (id) => {
  //   setOpenActionId(null);
  //   alert(`Cancel ${id}`);
  // };

  const handleSettlement = (id) => {
    setOpenActionId(null);
    alert(`Settlement ${id}`);
  };

  const handleCancel = (id, price) => {
    setOpenActionId(null);
    setSelectedBookingId(id);
    setrefundAmounts(price);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    setShowCancelModal(false);
    try {
      setLoadingfetch(true);

      // 1️⃣ Cancel booking
      const res = await fetch("/api/cancelbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyId: agencyId,
          bookingID: selectedBookingId,
        }),
      });

      const data = await res.json();
      console.log("check", data);
      console.log("check", data.voidServiceResponse);

      if (!data?.success) {
        throw new Error(data?.message || "Cancel booking failed");
      }

      // 2️⃣ Get wallet
      const walletRes = await fetch("/api/wallet");

      if (!walletRes.ok) {
        throw new Error("Failed to fetch wallet");
      }

      const wallet = await walletRes.json();

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // 3️⃣ Calculate refunded balance
      const refundAmount = refundAmounts; // adjust as needed
      const activeVoid = data?.voidServiceResponse?.[0]?.isActive;
      const voidFee = data?.voidServiceResponse?.[0]?.voidFee;
      const voidType = data?.voidServiceResponse?.[0]?.voidType;
      const voidserviceResponse = data.voidServiceResponse;

      const finalRefund = getFinalRefund(
        refundAmount,
        activeVoid,
        voidFee,
        voidType,
        voidserviceResponse
      );
      const newBalance = wallet.availableBalance + finalRefund;

      // 4️⃣ Update wallet
      const updateWalletPayload = {
        id: wallet.id,
        subAgencyId: wallet.subAgencyId,
        availableBalance: newBalance,
        creditBalance: wallet.creditBalance,
        debitBalance: wallet.debitBalance,
        createdAt: wallet.createdAt,
        updatedAt: new Date().toISOString(),
      };

      const updateWalletRes = await fetch("/api/updatemywallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateWalletPayload),
      });

      if (!updateWalletRes.ok) {
        throw new Error("Failed to update wallet");
      }

      // 5️⃣ Success UI updates
      alert(
        `Booking with Id ${selectedBookingId} has been canceled and wallet updated.`
      );
      setShowCancelModal(false);
      setSelectedBookingId(null);
      handleSearch();
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      alert(
        error.message || "Something went wrong while cancelling the booking."
      );
    } finally {
      setLoadingfetch(false);
    }
  };

  useEffect(() => {
    const close = () => setOpenActionId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  function formatDateTimeExact(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    console.log("VIEW BOOKING DATA:", viewBookingData);
  }, [viewBookingData]);

  console.log(viewBookingData?.data?.bookingID);

  // -------------------------------
  // Helper: get guest name by room
  // -------------------------------
  const details1 = viewBookingData?.data?.fullResponse?.Success?.BookingDetails;
  const details =
    viewBookingData?.data?.fullResponse?.Success?.BookingDetails?.Hotel;
  const CustomerRequest =
    viewBookingData?.data?.fullResponse?.Success?.BookingDetails
      ?.CustomerRequest;
  const getGuestNameByRoom = (roomNum) => {
    const guestRoom = details1?.GuestList?.find((g) => g.RoomNum === roomNum);

    if (!guestRoom || !guestRoom.GuestInfo?.length) return "N/A";

    return guestRoom.GuestInfo.map((g) =>
      `${g.Name?.First || ""} ${g.Name?.Last || ""}`.trim()
    ).join(", ");
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
      bedType: viewBookingData?.data?.extraInfo?.bedtpe || "N/A",
      guestName: getGuestNameByRoom(rate.RoomOccupancy?.RoomNum),
      number: formatGuestsCount(
        rate.RoomOccupancy?.AdultCount || "",
        rate.RoomOccupancy?.ChildCount || ""
      ),
      mealType: viewBookingData?.data?.extraInfo?.mealType || "N/A",
      roomNumber: rate.RoomOccupancy?.RoomNum,
    })) || [];

  useEffect(() => {
    if (showCancelModal || showCancelModalview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCancelModal, showCancelModalview]);

  const handleView = (booking) => {
    setOpenActionId(null);
    setViewBookingData(booking);
    const gList =
      booking?.data?.fullResponse?.Success?.BookingDetails?.GuestList;
    const dataBook = {
      price: Number(booking?.data?.extraInfo?.finalPrice).toFixed(2),
      agencyIds: booking?.agencys,

      reference: booking?.data?.bookingID,
      searchId: booking?.data?.searchId,
      agencyname: booking?.data?.extraInfo?.data?.agencyName,
      agencyphone: booking?.data?.extraInfo?.data?.agencyPhoneNumber,
      agencyaddress: booking?.data?.extraInfo?.data?.agencyAddress,
      agencyemail: booking?.data?.extraInfo?.data?.agencyEmail,
      logo: booking?.data?.extraInfo?.data?.logo,

      hotelName:
        booking?.data?.fullResponse?.Success?.BookingDetails?.Hotel?.HotelName,

      BookingID:
        booking?.data?.fullResponse?.Success?.BookingDetails?.BookingID,
      hotelAddress: booking?.data?.extraInfo?.address,
      guestPhone: booking?.data?.extraInfo?.tele_phone,

      cmerreq: CustomerRequest,

      arrivalDate:
        booking?.data?.fullResponse?.Success?.BookingDetails?.CheckInDate.split(
          " "
        )[0],
      departureDate:
        booking?.data?.fullResponse?.Success?.BookingDetails?.CheckOutDate.split(
          " "
        )[0],
      hDetail: booking?.data?.fullResponse?.Success?.BookingDetails?.GuestList,

      hotelDet:
        booking?.data?.fullResponse?.Success?.BookingDetails?.Hotel
          ?.RatePlanList,

      bType: booking?.data?.extraInfo?.bedtpe,
      mType: booking?.data?.extraInfo?.mealType,
    };

    const encrypted = encryptBookingObject(dataBook);
    const safe = encodeURIComponent(encrypted);

    window.open(`/DsrHoldVoucher?voucher=${safe}`, "_blank");

    // router.replace(`/DsrHoldVoucher?voucher=${safe}`);
  };

  return (
    <>
      <Header />
      {/* {now.toLocaleString()}

{!isHidden && (
  <div className="p-3 bg-blue-100">
    Visible until {targetTime.toLocaleTimeString()}
  </div>
)} */}

      {/* {!permissions &&
        
     

      <h3 style={{textAlign:"center", padding:"15px 0px 0px 0px", fontWeight:"bold", fontSize:"25px"}}>You are not allowed to access this page!</h3>
 } */}
      <div className="rprt">Daily Sale Reports (DSR)</div>

      {!permissions && (
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

      {permissions && (
        <div className="booki">
          {/* 🔹 Filters */}
          <div className="filter-section">
            <div className="filter-row">
              <div className="input-box">
                <label>Booking ID</label>
                <input
                  type="text"
                  name="bookingId"
                  value={filters.bookingId}
                  onChange={handleChange}
                  placeholder="Enter Booking ID"
                />
              </div>

              <div className="select-box">
                <label>Reservation Status</label>
                <select
                  name="reservationStatus"
                  value={filters.reservationStatus}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>

              {/* <div className="select-box">
                <label>Service Type</label>
                <select
                  name="serviceType"
                  value={filters.serviceType}
                  onChange={handleChange}
                >
                  <option>All</option>
                  <option>Hotel</option>
                </select>
              </div> */}

              <div className="input-box">
                <label>Name</label>
                <input
                  type="text"
                  name="leaderName"
                  value={filters.leaderName}
                  onChange={handleChange}
                  placeholder="Enter Leader Name"
                />
              </div>

              <div className="buttons">
                <button className="search-btn" onClick={handleSearch}>
                  SEARCH
                </button>
                <button className="reset-btn" onClick={handleReset}>
                  RESET
                </button>
              </div>
            </div>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 p-2 rounded-2xl mb-3 mt-3 flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-rose-900 text-xs font-bold leading-relaxed">
              <span className="text-rose-600 uppercase tracking-tighter mr-1">
                Alert:
              </span>
              Ensure cancellations are performed before the limit date. Once the
              time gone you will not be able to cancel booking.
            </p>
          </div>

          {/* 🔹 Result info */}
          {/* {results.length > 0 && (
            <div className="rprt-rslt">
              {results.length} Result(s) Found
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )} */}

          {results.length > 0 && (
            <div className="text-slate-700 text-[11px] font-bold flex justify-between mx-3 my-1 px-4 py-1">
              {results.length} Result(s) Found
              <span className="text-slate-700 text-[11px] font-bold flex justify-between">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* 🔹 Table */}
          <div className="overflow-x-auto">
            {" "}
            {/*overflow-x-auto */}
            <table className="w-full text-left border-collapse mb-10">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4 w-16 text-center">Action</th>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Leader Name</th>
                  <th className="px-6 py-4">Agency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Booked Date</th>
                  <th className="px-6 py-4">Cancellation Till</th>
                  <th className="px-6 py-4 text-center">Final Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                        <span className="text-slate-500 font-medium">
                          Fetching secure records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : results.length > 0 ? (
                  currentRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 relative text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionId(
                              openActionId === r.id ? null : r.id
                            );
                          }}
                          className="w-8 h-8  flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openActionId === r.id && (
                          <div
                            className="absolute left-16 overflow-y-auto top-4  w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-0  ring-1 ring-black/5 animate-in fade-in slide-in-from-left-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              {/* View Details */}
                              {/* <button

                            {/* Issue Voucher */}
                              <button
                                onClick={() => handleView(r, r.finalPrice)}
                                disabled={
                                  r.status === "CANCELLED" ||
                                  r.status === "FAILED"
                                }
                                className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2
                              ${
                                ["CANCELLED", "FAILED"].includes(r.status)
                                  ? "text-slate-400 cursor-not-allowed opacity-60"
                                  : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                              }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 text-emerald-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                View & Download
                              </button>

                              <div className="h-px bg-slate-100 my-1"></div>

                              {/* Cancel Booking */}
                              {(() => {
                                // const now = new Date();
                                const cancellationDateTime = new Date(
                                  r.cancelationDate
                                );
                                const adjustedCancellationTime = new Date(
                                  cancellationDateTime.getTime() - 60 * 1000 // ⏱ minus 1 minute
                                );
                                const isExpired =
                                  now > adjustedCancellationTime;
                                const isCancelled = [
                                  "CANCELLED",
                                  "FAILED",
                                ].includes(r.status);

                                const disabled = isExpired || isCancelled;

                                return (
                                  <button
                                    onClick={() =>
                                      !disabled &&
                                      handleCancel(r.id, r.TotalPrice)
                                    }
                                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2
              ${
                now > adjustedCancellationTime
                  ? "text-rose-300 cursor-not-allowed opacity-60"
                  : "text-rose-600 hover:bg-rose-50 cursor-pointer"
              }`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    Cancel Booking
                                  </button>
                                );
                              })()}

                              {/* Void / Settlement */}
                              {/* <button
        onClick={() => handleSettlement(r.id)}
        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        </svg>
        Void
      </button> */}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700 text-[11px] font-bold ">
                          {r.id || "Not Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 text-[11px] font-bold ">
                          {r.leader}
                          {/* {r.leader?.firstName || r.leader?.lastName
  ? `${r.leader?.firstName ?? ""} ${r.leader?.lastName ?? ""}`.trim()
  : "Not Available"} */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 text-[11px] font-bold ">
                          {r.agencyName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${
                            r.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : r.status === "CANCELLED"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-300 text-slate-40"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 text-[11px] font-bold ">
                          {r.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 text-[11px] font-bold flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 text-rose-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                          {(() => {
                            // const now = new Date();

                            const cancellationDateTime = new Date(
                              r.cancelationDate
                            );
                            const adjustedCancellationTime = new Date(
                              cancellationDateTime.getTime() - 60 * 1000 // ⏱ minus 1 minute
                            );

                            return now > adjustedCancellationTime
                              ? "Finalized"
                              : formatDateTimeExact(adjustedCancellationTime);
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-slate-700 text-[11px] font-bold ">
                          {Number(r.finalPrice).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-bold text-lg">
                          No records found
                        </p>
                        <p className="text-slate-400 text-sm">
                          Try adjusting your filters or use different search
                          keywords.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <Image
              style={{
                margin: "0px auto",
              }}
              // className="circular-left-right"
              src="/danger.png"
              alt="Loading"
              width={40}
              height={40}
            />
            <h2
              style={{
                fontWeight: "bold",
                padding: "5px 0px",
                fontSize: "19px",
              }}
            >
              Cancel Booking
            </h2>
            <p>You're going to cancel your "Booking"</p>

            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCancelModal(false)}>
                No, keep it.
              </button>

              <button className="btn danger" onClick={confirmCancelBooking}>
                Yes, Cancel!
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModalview && (
        <div className="fullscreen-modal">
          <div className="fullscreen-header">
            <h3>Booking Voucher</h3>
            <button
              className="close-btn"
              onClick={() => setShowCancelModalview(false)}
            >
              ✕
            </button>
          </div>

          <div className="fullscreen-content">
            <div style={{ background: "#f3f6fb", minHeight: "100vh" }}>
              <DownloadBtn
                booking={{
                  reference: viewBookingData?.data?.bookingID,
                  agencyname:
                    viewBookingData?.data?.extraInfo?.data?.agencyName,
                  agencyphone:
                    viewBookingData?.data?.extraInfo?.data?.agencyPhoneNumber,
                  agencyaddress:
                    viewBookingData?.data?.extraInfo?.data?.agencyAddress,
                  agencyemail:
                    viewBookingData?.data?.extraInfo?.data?.agencyEmail,
                  logo: viewBookingData?.data?.extraInfo?.data?.logo,

                  hotelName:
                    viewBookingData?.data?.fullResponse?.Success?.BookingDetails
                      ?.Hotel?.HotelName,
                  hotelAddress: viewBookingData?.data?.extraInfo?.address,
                  guestPhone: viewBookingData?.data?.extraInfo?.tele_phone,

                  cmerreq: CustomerRequest,

                  arrivalDate:
                    viewBookingData?.data?.fullResponse?.Success?.BookingDetails?.CheckInDate.split(
                      " "
                    )[0],
                  departureDate:
                    viewBookingData?.data?.fullResponse?.Success?.BookingDetails?.CheckOutDate.split(
                      " "
                    )[0],
                  tableRows,

                  // tableRows: viewBookingData?.data?.fullResponse?.Success?.BookingDetails,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

//  <div className="results">
//             {loading ? (
//               <p className="no-results">Loading bookings...</p>
//             ) : results.length > 0 ? (
//               <>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Action</th>
//                       <th>Booking ID</th>

//                       <th>Agency</th>
//                       <th>Booking Status</th>
//                       {/* <th>Service</th> */}
//                       {/* <th>Pay Status</th> */}
//                       <th>Booked Date</th>
//                       <th>Cancellation Till</th>
//                       <th>Price</th>
//                       {/* <th>Cancellation Till</th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRecords.map((r) => (
//                       <tr key={r.id}>
//                         <td className="action-cell">
//                           <span
//                             className="action-icon"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenActionId(
//                                 openActionId === r.id ? null : r.id
//                               );
//                             }}
//                           >
//                             ⋮
//                           </span>

//                           {openActionId === r.id && (
//                             <div
//                               className="action-dropdown"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               {/* VIEW */}
//                               {permissions?.canViewBookings && (
//                                 <div onClick={() => handleView(r)}>View</div>
//                               )}

//                               {/* CANCEL */}

//                               {(() => {
//                             // const now = new Date(); // current date + time
//                             const cancellationDateTime = new Date(
//                               r.cancelationDate
//                             ); // full date + time

//                             return now > cancellationDateTime
//                               ? <div
//                               style={{
//                                 cursor: "not-allowed",
//                                 color:"#aaa",
//                                 pointerEvents: "none",
//                                 opacity:0.6
//                               }}
//                               >Cancel</div>
//                               : <div
//                                 onClick={() =>
//                                   permissions?.canCancelBooking &&
//                                   r.getstatus !== "CANCELLED" &&
//                                   handleCancel(r.id, r.TotalPrice)
//                                 }
//                                 style={{
//                                   cursor:
//                                     r.getstatus === "CANCELLED" ||
//                                     !permissions?.canCancelBooking
//                                       ? "not-allowed"
//                                       : "pointer",
//                                   color:
//                                     r.getstatus === "CANCELLED" ||
//                                     !permissions?.canCancelBooking
//                                       ? "#aaa"
//                                       : "#000",
//                                   pointerEvents:
//                                     r.getstatus === "CANCELLED" ||
//                                     !permissions?.canCancelBooking
//                                       ? "none"
//                                       : "auto",
//                                   opacity:
//                                     r.getstatus === "CANCELLED" ||
//                                     !permissions?.canCancelBooking
//                                       ? 0.6
//                                       : 1,
//                                 }}
//                               >
//                                 Cancel
//                               </div>;
//                           })()}

//                               {/* VOID / SETTLEMENT */}
//                               <div
//                                 onClick={() =>
//                                   permissions?.canSettle &&
//                                   handleSettlement(r.id)
//                                 }
//                                 style={{
//                                   cursor: permissions?.canSettle
//                                     ? "pointer"
//                                     : "not-allowed",
//                                   color: permissions?.canSettle
//                                     ? "#000"
//                                     : "#aaa",
//                                   pointerEvents: permissions?.canSettle
//                                     ? "auto"
//                                     : "none",
//                                   opacity: permissions?.canSettle ? 1 : 0.6,
//                                 }}
//                               >
//                                 Void
//                               </div>
//                             </div>
//                           )}
//                         </td>
//                         <td>{r.id}</td>

//                         {/* <td>{r.leader}</td> */}
//                         <td>{r.agencyName}</td>
//                         <td>{r.status == "Confirmed" ? "Booked" : r.status}</td>
//                         {/* <td>{r.paymentstatus}</td> */}
//                         {/* <td>{r.service}</td> */}
//                         <td>{r.date}</td>
//                         <td>
//                           {/* {(() => {
//                             const now = new Date(); // current date + time
//                             const cancellationDateTime = new Date(
//                               r.cancelationDate
//                             ); // full date + time

//                             return now > cancellationDateTime
//                               ? "Time Gone"
//                               : formatDateTimeExact(r.cancelationDate);
//                           })()} */}

//                           {(() => {
//   const now = new Date();

//   const cancellationDateTime = new Date(r.cancelationDate);
//   const adjustedCancellationTime = new Date(
//     cancellationDateTime.getTime() - 60 * 1000 // ⏱ minus 1 minute
//   );

//   return now > adjustedCancellationTime
//     ? "Time Gone"
//     : formatDateTimeExact(adjustedCancellationTime);
// })()}

//                         </td>

//                         <td>{Number(r.finalPrice).toFixed(2)}</td>
//                         {/* <td>{formatDateTimeExact(r.cancelationDate)}</td> */}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* 🔹 Pagination */}
//                 {totalPages > 1 && (
//                   <div className="pagination">
//                     <button
//                       onClick={prevPage}
//                       disabled={currentPage === 1}
//                       className="page-btn"
//                     >
//                       ◀ Previous
//                     </button>

//                     <span className="page-info">
//                       Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                       onClick={nextPage}
//                       disabled={currentPage === totalPages}
//                       className="page-btn"
//                     >
//                       Next ▶
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p className="no-results">No bookings found.</p>
//             )}
//           </div>
