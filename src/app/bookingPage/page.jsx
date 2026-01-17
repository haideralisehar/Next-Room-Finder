"use client";
import React, { useState, useEffect } from "react";
import "./mybooking.css";
import Header from "../components/Header";
import Cookies from "js-cookie";
import Image from "next/image";
import DownloadBtn from "../print/Voucher/DownloadBtn";
import { encryptBookingObject } from "../api/utils/voucherdta";
import { apiFetch } from "../lib/apiFetch";
export default function MyBookingsPage() {
  const [filters, setFilters] = useState({
    bookingId: "",
    reservationStatus: "",
    serviceType: "All",
    leaderName: "",
  });

  const agencyId = Cookies.get("agencyId");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [loadingfetch, setLoadingfetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showCancelModalview, setShowCancelModalview] = useState(false);
  const [viewBookingData, setViewBookingData] = useState(null);
  const [isShows, setisShows] = useState(true);

  const handleStatus = () => {
    setisShows(false);
  };

  const recordsPerPage = 8;

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // ⏱ checks every second (use 60000 for 1 min)

    return () => clearInterval(timer);
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Fetch + Filter bookings
  const handleSearch = async () => {
    try {
      setLoadingfetch(true);
      setisShows(true);

      // const agencyId = "58499949-0de8-4c41-a313-478679ce2faa";
      const hold = "pending";

      const res = await apiFetch(
        `/api/myBookings?agencyId=${agencyId}&paymentstatus=${hold}`
      );
      const json = await res.json();

      setLoadingfetch(false);

      if (!json.success) {
        setLoadingfetch(false);
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

  /* =========================
     Actions
  ========================= */
  // const handleView = (booking) => {
  //   console.log(viewBookingData);
  //   setOpenActionId(null);
  //   setViewBookingData(booking);
  //   setShowCancelModalview(true);
  // };

  const handleCancel = (id) => {
    setOpenActionId(null);
    setSelectedBookingId(id);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setLoadingfetch(true);

      const res = await fetch("/api/cancelbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyId: agencyId,
          bookingID: selectedBookingId,
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        alert(data?.message);
      }

      alert(`Booking with Id ${selectedBookingId} has been canceled.`);
      setShowCancelModal(false);
      setSelectedBookingId(null);
      handleSearch();
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      alert("Something went wrong while cancelling the booking.");
    } finally {
      setLoadingfetch(false);
    }
  };

  // const handleSettlement = (id) => {
  //   setOpenActionId(null);
  //   alert(`Settlement ${id}`);
  // };

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

  const [nows, setNows] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNows(new Date());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  const handleView = (booking) => {
    setOpenActionId(null);
    setViewBookingData(booking);

     const dataBook = {
      price: Number(
                    booking?.data?.extraInfo?.finalPrice
                  ).toFixed(2),
                  agencyIds: booking?.agencys,
                  // trans_id: viewBookingData?.data?.extraInfo?.transactionId,
                  isShow: isShows,
                  reference: booking?.data?.bookingID,
                  searchId: booking?.data?.searchId,
                  agencyname:
                    booking?.data?.extraInfo?.data?.agencyName,
                  agencyphone:
                    booking?.data?.extraInfo?.data?.agencyPhoneNumber,
                  agencyaddress:
                    booking?.data?.extraInfo?.data?.agencyAddress,
                  agencyemail:
                    booking?.data?.extraInfo?.data?.agencyEmail,
                  logo: booking?.data?.extraInfo?.data?.logo,

                  hotelName:
                    booking?.data?.fullResponse?.Success?.BookingDetails
                      ?.Hotel?.HotelName,

                  BookingID:
                    booking?.data?.fullResponse?.Success?.BookingDetails
                      ?.BookingID,
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

                  hotelDet: booking?.data?.fullResponse?.Success?.BookingDetails?.Hotel?.RatePlanList,

                  bType: booking?.data?.extraInfo?.bedtpe,
                  mType: booking?.data?.extraInfo?.mealType

     };
    
    const encrypted = encryptBookingObject(dataBook);
    const safe = encodeURIComponent(encrypted);

    window.open(
              `/DsrHoldVoucher?voucher=${safe}`,
              "_blank"
            );

    // router.replace(`/DsrHoldVoucher?voucher=${safe}`);

  };

  return (
    <>
      <Header />
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="rprt">My Bookings</div>
        {/* <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          System Time
        </p>
        <p className="text-sm font-bold text-slate-700">
          {nows.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div> */}
      </div>

      {/* <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Bookings</h1> */}

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
                <option>FAILED</option>
                <option>CANCELLED</option>
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
            Ensure cancellations are performed before the limit date. Once the time gone you will not be able to cancel booking.
          </p>
        </div>

        {/* 🔹 Result info */}
         {results.length > 0 && (
          <div className="text-slate-700 text-[11px] font-bold flex justify-between mx-3 my-1 px-4 py-1">
            {results.length} Result(s) Found
            <span className="text-slate-700 text-[11px] font-bold flex justify-between">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {/* 🔹 Table */}

        <div className="overflow-x-auto"> {/*overflow-x-auto */}
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
                <th className="px-6 py-4 text-left">Final Price</th>
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
                          setOpenActionId(openActionId === r.id ? null : r.id);
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
                              onClick={() => handleView(r)}
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
                              View & Issue Voucher
                            </button>

                            <div className="h-px bg-slate-100 my-1"></div>

                            {/* Cancel Booking */}
                            {(() => {
                              const now = new Date();
                              const cancellationDateTime = new Date(
                                r.cancelationDate
                              );
                              const isExpired = now > cancellationDateTime;
                              const isCancelled = [
                                "CANCELLED",
                                "FAILED",
                              ].includes(r.status);

                              const disabled = isExpired || isCancelled;

                              return (
                                <button
                                  onClick={() =>
                                    !disabled && handleCancel(r.id)
                                  }
                                  className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2
              ${
                disabled
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
                        {/* {formatDateTimeExact(r.cancelationDate)} */}
                        {r.cancelationDate &&
                        !isNaN(new Date(r.cancelationDate))
                          ? formatDateTimeExact(r.cancelationDate)
                          : "Not Available"}
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
        {/* <div className="results">
          {loading ? (
            <p className="no-results">Loading bookings...</p>
          ) : results.length > 0 ? (
            <>
              <table>
                <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
          <th className="px-6 py-4 w-16 text-center">Action</th>
          <th className="px-6 py-4">Booking ID</th>
          <th className="px-6 py-4">Leader Name</th>
          <th className="px-6 py-4">Agency</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Booked Date</th>
          <th className="px-6 py-4">Cancellation Till</th>
          <th className="px-6 py-4 text-right">Final Price</th>
        </tr>
      </thead>
                <tbody>
                  {currentRecords.map((r) => (
                    <tr key={r.id}>
                      <td className="action-cell">
                        <span
                          className="action-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionId(
                              openActionId === r.id ? null : r.id
                            );
                          }}
                        >
                          ⋮
                        </span>

                        {openActionId === r.id && (
                          <div
                            className="action-dropdown"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onClick={() => handleView(r)}
                              style={{
                                cursor:
                                  r.getstatus === "CANCELLED"
                                    ? "not-allowed"
                                    : "pointer",
                                color:
                                  r.getstatus === "CANCELLED" ? "#aaa" : "#000",
                                pointerEvents:
                                  r.getstatus === "CANCELLED" ? "none" : "auto",
                                opacity: r.getstatus === "CANCELLED" ? 0.6 : 1,
                              }}
                            >
                              View & Issue
                            </div>

                            {(() => {
                              
                              const cancellationDateTime = new Date(
                                r.cancelationDate
                              ); // full date + time

                              return now > cancellationDateTime ? (
                                <div
                                  style={{
                                    cursor: "not-allowed",
                                    color: "#aaa",
                                    pointerEvents: "none",
                                    opacity: 0.6,
                                  }}
                                >
                                  Cancel
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleCancel(r.id)}
                                  style={{
                                    cursor:
                                      r.getstatus === "CANCELLED" || "FAILED"
                                        ? "not-allowed"
                                        : "pointer",
                                    color:
                                      r.getstatus === "CANCELLED"
                                        ? "#aaa"
                                        : "#000",
                                    pointerEvents:
                                      r.getstatus === "CANCELLED"
                                        ? "none"
                                        : "auto",
                                    opacity:
                                      r.getstatus === "CANCELLED" ? 0.6 : 1,
                                  }}
                                >
                                  Cancel
                                </div>
                              );
                            })()}

                            <div onClick={() => handleSettlement(r.id)}>
                              Void
                            </div>
                          </div>
                        )}
                      </td>

                      <td>{r.id}</td>
                      <td>{r.leader}</td>
                      <td>{r.agencyName}</td>
                      <td>{r.status == "Confirmed" ? "Booked" : r.status}</td>
                    
                      <td>{r.date}</td>
                      <td>{formatDateTimeExact(r.cancelationDate)}</td>
                      <td>{Number(r.finalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    ◀ Previous
                  </button>

                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </>
          ) : (
                  <tr>
                    <td colSpan={8} className="py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-bold text-lg">No records found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or use different search keywords.</p>
                      </div>
                    </td>
                  </tr>
                )}
        </div> */}

        {totalPages > 1 && (
            <div className="px-6 py-5 bg-white border-t border-slate-50 flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-900">{currentRecords.length}</span> of <span className="text-slate-900">{results.length}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div className="flex items-center gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                     >
                       {i + 1}
                     </button>
                   ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          )}
      </div>

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
                  price: Number(
                    viewBookingData?.data?.extraInfo?.finalPrice
                  ).toFixed(2),
                  agencyIds: viewBookingData?.agencys,
                  // trans_id: viewBookingData?.data?.extraInfo?.transactionId,
                  isShow: isShows,
                  reference: viewBookingData?.data?.bookingID,
                  searchId: viewBookingData?.data?.searchId,
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

                  BookingID:
                    viewBookingData?.data?.fullResponse?.Success?.BookingDetails
                      ?.BookingID,
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
                onAfterApiSuccess={handleSearch}
                onStatus={handleStatus}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
