"use client";
import React, { useState, useEffect } from "react";
import "./mybooking.css";
import Header from "../components/Header";
import Cookies from "js-cookie";
import Image from "next/image";
import DownloadBtn from "../print/Voucher/DownloadBtn";

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


  const recordsPerPage = 10;

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Fetch + Filter bookings
  const handleSearch = async () => {
    try {
       setLoadingfetch(true);

      // const agencyId = "58499949-0de8-4c41-a313-478679ce2faa"; 
      const hold = "pending";

      const res = await fetch(`/api/myBookings?agencyId=${agencyId}&paymentstatus=${hold}`);
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
            b.leader.toLowerCase().includes(filters.leaderName.toLowerCase())) &&
          (!filters.reservationStatus ||
            b.status === filters.reservationStatus) &&
          (filters.serviceType === "All" ||
            b.service === filters.serviceType)
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
  const currentRecords = results.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
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
  const handleView = (booking) => {
    console.log(viewBookingData);
    setOpenActionId(null);
    setViewBookingData(booking);
    setShowCancelModalview(true);
  };

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

    if (!data?.Success) {
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

      <div className="rprt">My Bookings</div>

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

            <div className="select-box">
              <label>Service Type</label>
              <select
                name="serviceType"
                value={filters.serviceType}
                onChange={handleChange}
              >
                <option>All</option>
                <option>Hotel</option>
              </select>
            </div>

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

        <div className="reminder" style={{width:"100%", height:"auto"}}>

          <p className="title">
            🚨 Be insured, if you did not cancel the booking before the cancelation date, the amount will automatically be deducted from your wallet and booking will be confirmed.
          </p>

        </div>

        {/* 🔹 Result info */}
        {results.length > 0 && (
          <div className="rprt-rslt">
            {results.length} Result(s) Found
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {/* 🔹 Table */}
        <div className="results">
          {loading ? (
            <p className="no-results">Loading bookings...</p>
          ) : results.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Booking ID</th>
                    <th>Name</th>
                    <th>Agency</th>
                    <th>Booking Status</th>
                    {/* <th>Pay Status</th> */}
                    {/* <th>Service</th> */}
                    <th>Booked Date</th>
                    <th>Cancellation Till</th>
                    <th>Price</th>
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


                           
                            <div onClick={() => handleCancel(r.id)} 
                            style={{
    cursor: r.getstatus === "CANCELLED" ? "not-allowed" : "pointer",
    color: r.getstatus === "CANCELLED" ? "#aaa" : "#000",
    pointerEvents: r.getstatus === "CANCELLED" ? "none" : "auto",
    opacity: r.getstatus === "CANCELLED" ? 0.6 : 1,}}
    >
                              Cancel
                            </div>

                            <div onClick={() => handleSettlement(r.id)}>
                              Void
                            </div>
                          </div>
                        )}
                      </td>
                      
                       <td>{r.id}</td>
                      <td>{r.leader}</td>
                      <td>{r.agencyName}</td>
                      <td>{r.status =="Confirmed" ? "Booked" : r.status}</td>
                      {/* <td>{r.paymentstatus}</td> */}
                      {/* <td>{r.service}</td> */}
                      <td>{r.date}</td>
                      <td>{formatDateTimeExact(r.cancelationDate)}</td>
                      <td>{Number(r.finalPrice).toFixed(2)}</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 🔹 Pagination */}
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
            <p className="no-results">No bookings found.</p>
          )}
        </div>
      </div>

      {showCancelModal && (
  <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()}
    >
       <Image
                  style={{
                   margin:"0px auto"
                  }}
                   // className="circular-left-right"
                   src="/danger.png"
                   alt="Loading"
                   width={40}
                   height={40}
                 />
                 <h2 style={{fontWeight:"bold", padding:"5px 0px", fontSize:"19px"}}>Cancel Booking</h2>
                 <p>You're going to cancel your "Booking"</p>

      <div className="modal-actions">
        

        <button
          className="btn"
          onClick={() => setShowCancelModal(false)}
        >
          No, keep it.
        </button>

        <button
          className="btn danger"
          onClick={confirmCancelBooking}
        >
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
                  price: Number(viewBookingData?.data?.extraInfo?.finalPrice).toFixed(2),
                  agencyIds: viewBookingData?.agencys,
                  trans_id: viewBookingData?.data?.extraInfo?.transactionId,
                  isShow: true,
                  reference: viewBookingData?.data?.bookingID,
                  agencyname:
                    viewBookingData?.data?.extraInfo?.data?.agencyName,
                  agencyphone:
                    viewBookingData?.data?.extraInfo?.data?.agencyPhoneNumber,
                  agencyaddress:
                    viewBookingData?.data?.extraInfo?.data?.agencyAddress,
                  agencyemail:
                    viewBookingData?.data?.extraInfo?.data?.agencyEmail,

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
