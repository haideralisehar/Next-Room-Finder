"use client";
import React, { useState, useEffect, cache, useRef } from "react";
import styles from "../booking/Booking.module.css";
import "../booking/booking.css";
import { FaStar, FaRegStar } from "react-icons/fa"; // ⭐ Icons
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSearchParams } from "next/navigation";
import StarRating from "../components/rating";
import { useBhdCurrency } from "../Context/BHDCurrency";
import TermsAndConditions from "../terms-conditions/page";
import CountrySelector from "../components/CountrySelector";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import countryCodes from "../static_data/countrycode";
import { encryptBookingId } from "../api/utils/bookingHash";

import { useDispatch } from "react-redux";
import {
  setConfirmedBooking,
  setConfirmedBookingError,
} from "../redux/confirmedBookingSlice";

export default function BookingPage() {
  const router = useRouter();
   const encrypted = encryptBookingId(123215653);
  const { Bhdcurrency, convertPrice } = useBhdCurrency();
  const searchParams = useSearchParams();
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const dispatch = useDispatch();

  const [acknowledged, setAcknowledged] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const priceConfirmResponse = useSelector(
    (state) => state.priceConfirm.priceConfirmData
  );

  const [starRating, setstarRating] = useState("");
  const [location, setlocation] = useState("");
  const [hotelName, sethotelName] = useState("");
  const [loadingfetch, setLoadingfetch] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [guestForms, setGuestForms] = useState([]);
  const [booking, setBooking] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingSubmitType, setPendingSubmitType] = useState(null);
  const formRef = useRef(null);
  const submitRef = useRef(null);

  //   const [contactInfo, setContactInfo] = useState({
  //   countryCode: "",
  //   phone: "",
  //   email: "",
  // });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+1",
    phone: "",
    email: "",
    guestType: "Myself",
    specialRequest: "",
    termsAccepted: false,
    paymentMethod: "card",
  });

  const [open, setOpen] = useState(false);
const dropdownRef = useRef(null);

const usa = countryCodes.find(c => c.code === "+1");

const [selectedCountry, setSelectedCountry] = useState(usa);


useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



  const agencyName = priceConfirmResponse?.agencyDetails?.data?.agencyName;
  const agencyID = priceConfirmResponse?.agencyDetails?.data?.id;

  const room =
    priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]
      ?.RatePlanList?.[0]?.RoomOccupancy;
  const Remark =
    priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]
      ?.Remark;
  const Room_Name =
    priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]
      ?.RatePlanList?.[0]?.RatePlanName;
  console.log("room, ", room);
  console.log("selected_datas", priceConfirmResponse);

  function applyDiscountAndMarkup(priceConfirmResponse) {
    const hotel =
      priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0];

    useEffect(() => {
      if (priceConfirmResponse?.room_cont) {
        setRooms(priceConfirmResponse.room_cont);
      }
    }, [priceConfirmResponse]);

    useEffect(() => {
      if (!rooms || rooms.length === 0) return;

      const allRoomsGuests = rooms.map((room, roomIndex) => {
        const guests = [];

        // Adults
        for (let i = 0; i < room.adults; i++) {
          guests.push({
            type: "adult",
            firstName: "",
            lastName: "",
            age: null,
            isAdult: true,
            roomIndex,
          });
        }

        // Children
        room.childrenAges?.forEach((age) => {
          guests.push({
            type: "child",
            firstName: "",
            lastName: "",
            age,
            isAdult: false,
            roomIndex,
          });
        });

        return guests;
      });

      setGuestForms(allRoomsGuests);
    }, [rooms]);

    if (!hotel) {
      console.error("HotelList[0] not found");
      return null;
    }

    let totalPrice = hotel.TotalPrice;
    console.log(`${totalPrice}`);

    const discount = priceConfirmResponse?.agencyDetails?.Discounts;
    const markup = priceConfirmResponse?.agencyDetails?.Markups;

    console.log(`${markup.MarkupFee} ${markup.MarkupType}`);

    // ------------------------------
    // Apply DISCOUNT
    // ------------------------------
    if (discount) {
      if (discount.DiscountType === "Percentage") {
        totalPrice = totalPrice - (totalPrice * discount.DiscountFee) / 100;
        console.log(`${totalPrice}`);
      } else if (discount.DiscountType === "Amount") {
        totalPrice = totalPrice - discount.DiscountFee;
      }
    }

    // ------------------------------
    // Apply MARKUP
    // ------------------------------
    if (markup) {
      if (markup.MarkupType === "Percentage") {
        totalPrice = totalPrice + (totalPrice * markup.MarkupFee) / 100;
      } else if (markup.MarkupType === "Amount") {
        totalPrice = totalPrice + markup.MarkupFee;
      }
    }

    return totalPrice;
  }

  const finalPrice = applyDiscountAndMarkup(priceConfirmResponse);

  console.log(finalPrice);

  // Load from localStorage on mount
  useEffect(() => {
    const storedAck = localStorage.getItem("acknowledged");
    if (storedAck === "true") {
      setAcknowledged(true);
    }

    if (!priceConfirmResponse) {
      console.log("No Data Fount for this room confirmation");
    }

    try {
      const apiResponse = priceConfirmResponse;
      const rating_star = apiResponse.rating || "";
      const address = apiResponse?.agencyDetails?.address || "";
      const hotel_name =
        apiResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]
          ?.HotelName || "";

      // const checkIn =
      // apiResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate || "";

      sethotelName(hotel_name);
      setlocation(address);
      setstarRating(rating_star);
    } catch (err) {
      console.error("Failed to parse selectedHotel:", err);
      setLoading(false);
    }
  }, []);

  console.log(starRating);
  console.log(priceConfirmResponse?.image);

  const handleTermsCheckbox = (e) => {
    if (!acknowledged) {
      e.preventDefault();
      setShowWarningPopup(true); // show warning if not acknowledged
      return;
    }
    handleChange(e); // only allow change if acknowledged
  };

  const handleAcknowledge = () => {
    localStorage.setItem("acknowledged", "true");
    setAcknowledged(true);
    setShowAmenitiesPopup(false); // close terms popup
    // ❌ don't touch formData.termsAccepted here
  };

  // Get data from query
  const hotel = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    location: searchParams.get("location"),
    price: 100,
    image: searchParams.get("image"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    position: searchParams.get("position"),
    count: searchParams.get("count"),
    nights: searchParams.get("nights"),
    rating: searchParams.get("rating"),
    roomprice: searchParams.get("roomPrice"),
    roomTitle: searchParams.get("roomTitle"),
    roomCost: searchParams.get("roomCost"),

    totalRooms: searchParams.get("totalRooms"),
    rooms: searchParams.get("rooms")
      ? JSON.parse(searchParams.get("rooms"))
      : [],
    SelectedRoom: searchParams.get("selectedRoom")
      ? JSON.parse(searchParams.get("selectedRoom"))
      : [],
  };

  // const rume = JSON.stringify(hotel.rooms);

  // console.log("Hotel Data:", hotel.SelectedRoom);

  // Calculate total price of selected rooms
  const totalPrice = hotel.SelectedRoom.reduce((acc, room) => {
    return acc + Number(room.price); // Convert price to number just in case
  }, 0);

  const handleCountrySelect = (countryName) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: countryName.code,
    }));
  };

  console.log(formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle form submit safely
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions before proceeding.");
      return;
    }

    setLoading(true);
    setLoadingfetch(true);

    try {
      const finalPrice = applyDiscountAndMarkup(priceConfirmResponse);
      const reference =
        priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.ReferenceNo;

      const response = await fetch("/api/tap/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: 101,
          logId: 5001,
          amount: convertPrice(finalPrice),
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            country_Code: formData.countryCode,
          },

          metadata: {
            booking_reference: reference,
            room_num: room?.RoomNum,
          },
        }),
      });

      const data = await response.json();
      setLoadingfetch(false);

      // ✅ Handle Tap API response clearly
      if (response.ok && data?.url) {
        window.location.href = data.url;
        setLoadingfetch(false);
      } else {
        console.error("Payment Error:", data);
        const message =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || "Unable to process payment.";
        alert("Error: " + message);
        setLoadingfetch(false);
      }
    } catch (err) {
      console.error("Payment Exception:", err);
      alert("Payment failed: " + err.message);
      setLoadingfetch(false);
    } finally {
      setLoading(false);
      setLoadingfetch(false);
    }
  };

  const parseDate = (str) => {
    const [day, month, year] = str.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  // const formatDate = (dateString) => {
  //   const date = parseDate(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  const handleGuestChange = (roomIndex, guestIndex, field, value) => {
    setGuestForms((prev) => {
      const updated = [...prev];
      updated[roomIndex][guestIndex][field] = value;
      return updated;
    });
  };

  const resetAllFields = () => {
    setGuestForms((prev) =>
      prev.map((roomGuests) =>
        roomGuests.map((g) => ({
          ...g,
          firstName: "",
          lastName: "",
          age: g.isAdult ? null : g.age, // keep child age only
        }))
      )
    );

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "",
      specialRequest: "",
      guestType: "Myself",
      paymentMethod: "card",
      termsAccepted: false,
    });
  };

  // const handleSubmits = async (e) => {
  //   e.preventDefault();

  //   const finalGuestList = guestForms.map((roomGuests, roomIndex) => {
  //     let adultIndex = 0;

  //     const guestInfo = roomGuests.map((g) => {
  //       let guest = {
  //         name: { first: g.firstName, last: g.lastName },
  //         isAdult: g.isAdult,
  //         age: g.isAdult ? null : g.age,
  //       };

  //       // FIRST ADULT OF EACH ROOM → Attach Contact Info
  //       if (g.type === "adult") {
  //         adultIndex++;

  //         // Only first room first adult uses contact info
  //         if (roomIndex === 0 && adultIndex === 1) {
  //           guest.name.first = formData.firstName || g.firstName;
  //           guest.name.last = formData.lastName || g.lastName;
  //         }
  //       }
  //       setFormData({
  //         ...formData,
  //         firstName: g.firstName,
  //         lastName: g.lastName
  //       });

  //       return guest;
  //     });

  //     return {
  //       roomNum: roomIndex + 1, // room.RoomNum if API gives it
  //       guestInfo,
  //     };
  //   });

  //   setLoadingfetch(true);
  //   const bookingResponse = await fetch('/api/bookingConfirm', {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       checkInDate: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate,
  //       checkOutDate: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckOutDate,
  //       numOfRooms: priceConfirmResponse?.room_cont.length,

  //       // ⭐ Use your dynamically generated finalGuestList
  //       guestList: finalGuestList,

  //       contact: {
  //         name: {
  //           first: "John",
  //           last: "Doe",
  //         },
  //         email: "johndoe@example.com",
  //         phone: "+923001234567",
  //       },

  //       clientReference: `client-${Date.now() + 10000}`,
  //       referenceNo: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.ReferenceNo,
  //     }),
  //   });

  //   const bookingResult = await bookingResponse.json();
  //   setBooking(bookingResult);
  //   resetAllFields();
  //    setLoadingfetch(false);

  //   //  if(bookingResult?.Error){

  //   //  }
  //   //  router.replace("/");

  //   console.log("Booking Confirm Result:", bookingResult);

  // }

  const [submitType, setSubmitType] = useState(null);

  //   const handleSubmits = async (e) => {
  //   e.preventDefault();

  //   // ---------------------------------------------------
  //   // Step 1: Build final guest list
  //   // ---------------------------------------------------
  //   const finalGuestList = guestForms.map((roomGuests, roomIndex) => {
  //     let adultIndex = 0;

  //     const guestInfo = roomGuests.map((g) => {
  //       let guest = {
  //         name: { first: g.firstName, last: g.lastName },
  //         isAdult: g.isAdult,
  //         age: g.isAdult ? null : g.age,
  //       };

  //       // Replace first adult in room 1 with primary user name
  //       if (g.type === "adult") {
  //         adultIndex++;
  //         if (roomIndex === 0 && adultIndex === 1) {
  //           guest.name.first = formData.firstName || g.firstName;
  //           guest.name.last = formData.lastName || g.lastName;
  //         }
  //       }

  //       return guest;
  //     });

  //     return {
  //       roomNum: roomIndex + 1,
  //       guestInfo,
  //     };
  //   });

  //   // ---------------------------------------------------
  //   // Step 2: Build Booking Confirm Payload
  //   // ---------------------------------------------------
  //   const bookingPayload = {
  //     agencyId: priceConfirmResponse?.agencyDetails?.data?.id,
  //     searchId:priceConfirmResponse?.agencyDetails?.searchId,
  //     checkInDate:
  //       priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate,
  //     checkOutDate:
  //       priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckOutDate,
  //     numOfRooms: priceConfirmResponse?.room_cont?.length,
  //     guestList: finalGuestList,

  //     contact: {
  //       name: {
  //         first: formData.firstName || "John",
  //         last: formData.lastName || "Doe",
  //       },
  //       email: formData.email || "johndoe@example.com",
  //       phone: formData.phone || "+923001234567",
  //     },

  //     bookingMeta: priceConfirmResponse?.agencyDetails,
  //     clientReference: `client-${Date.now()}`,
  //     referenceNo:
  //       priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.ReferenceNo,
  //   };

  //   setLoadingfetch(true);

  //   try {
  //     const res = await fetch("/api/walletDeduct", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         orderAmount: convertPrice(finalPrice),
  //         bookingPayload,
  //         agencyName,
  //         searchId: priceConfirmResponse?.agencyDetails?.searchId

  //       }),
  //     });

  //     const data = await res.json();
  //     setLoadingfetch(false);

  //     console.log("Booking API Response →", data);

  //     // ---------------------------------------------
  //     // ❌ If success is false or error exists
  //     // ---------------------------------------------
  //     if (!data.success) {
  //       dispatch(setConfirmedBookingError(data.message || "Booking failed"));
  //       alert(data.message || "Booking failed");
  //       return;
  //     }

  //     // ---------------------------------------------
  //     // ✔️ Success Case
  //     // ---------------------------------------------
  //     const finalBookingData = {
  //       ...data, // success + message
  //       booking: data.booking, // full booking (AuditData + Success)
  //       agency: priceConfirmResponse?.agencyDetails?.data,
  //       tel: priceConfirmResponse?.agencyDetails?.tele_phone,
  //       address: priceConfirmResponse?.agencyDetails?.address,
  //       mealType: priceConfirmResponse?.agencyDetails?.mealType,
  //       bedtpe: priceConfirmResponse?.agencyDetails?.bedtpe

  //     };

  //     // Save in Redux
  //     dispatch(setConfirmedBooking(finalBookingData));

  //     console.log("Confirmed Booking Saved →", finalBookingData);

  //     alert("Payment deducted & booking confirmed!");

  //     // Redirect user
  //     router.replace("/GetVoucher");

  //   } catch (error) {
  //     setLoadingfetch(false);
  //     dispatch(setConfirmedBookingError(error.message));
  //     alert(error.message);
  //   }
  // };

  const handleConfirm = async () => {
    setSubmitType("HOLD");
  };

  const handleSubmits = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // Step 1: Build final guest list
    // ---------------------------------------------------
    const finalGuestList = guestForms.map((roomGuests, roomIndex) => {
      let adultIndex = 0;

      const guestInfo = roomGuests.map((g) => {
        let guest = {
          name: { first: g.firstName, last: g.lastName },
          isAdult: g.isAdult,
          age: g.isAdult ? null : g.age,
        };

        // Replace first adult in room 1 with primary user name
        if (g.type === "adult") {
          adultIndex++;
          if (roomIndex === 0 && adultIndex === 1) {
            guest.name.first = formData.firstName || g.firstName;
            guest.name.last = formData.lastName || g.lastName;
          }
        }

        return guest;
      });

      return {
        roomNum: roomIndex + 1,
        guestInfo,
      };
    });

    const agencyDet = priceConfirmResponse?.agencyDetails;

    const newData = {
      finalPrice,
      ...agencyDet,
    };

    // ---------------------------------------------------
    // Step 2: Build Booking Confirm Payload
    // ---------------------------------------------------
    const bookingPayload = {
      agencyId: priceConfirmResponse?.agencyDetails?.data?.id,
      searchId: priceConfirmResponse?.agencyDetails?.searchId,
      checkInDate:
        priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate,
      checkOutDate:
        priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckOutDate,
      numOfRooms: priceConfirmResponse?.room_cont?.length,
      guestList: finalGuestList,

      contact: {
        name: {
          first: formData.firstName || "John",
          last: formData.lastName || "Doe",
        },
        email: formData.email ,
        phone: formData.phone 
      },

      customerRequest: formData.specialRequest || "",

      bookingMeta: newData,
      clientReference: `client-${Date.now()}`,
      referenceNo:
        priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.ReferenceNo,

      PaymentStatus: submitType === "HOLD" ? "pending" : "paid",
    };
    setLoadingfetch(true);

    try {
      let res;
      let data;

      // ===================================================
      // ISSUE BOOKING (Wallet Deduct + Confirm)
      // ===================================================
      if (submitType === "BOOK") {
        res = await fetch("/api/walletDeduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderAmount: finalPrice,
            bookingPayload,
            agencyName,
            searchId: priceConfirmResponse?.agencyDetails?.searchId,
          }),
        });

        data = await res.json();
      }

      // ===================================================
      // HOLD BOOKING (No Wallet Deduct)
      // ===================================================
      if (submitType === "HOLD") {
        res = await fetch("/api/holdBooking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderAmount: finalPrice,
            bookingPayload,
            agencyName,
            agencyID,
            searchId: priceConfirmResponse?.agencyDetails?.searchId,
          }),
        });

        data = await res.json();
      }

      setLoadingfetch(false);

      // ---------------------------------------------------
      // Error handling
      // ---------------------------------------------------
      if (!data?.success) {
        dispatch(setConfirmedBookingError(data.message || "Booking failed"));
        alert(data.message || "Booking failed");
        return;
      }

      // ---------------------------------------------------
      // Success handling
      // ---------------------------------------------------
      const finalBookingData = {
        ...data,
        // booking: data.booking,
        customerrequest: formData.specialRequest,
        agency: priceConfirmResponse?.agencyDetails?.data,
        tel: priceConfirmResponse?.agencyDetails?.tele_phone,
        address: priceConfirmResponse?.agencyDetails?.address,
        mealType: priceConfirmResponse?.agencyDetails?.mealType,
        bedtpe: priceConfirmResponse?.agencyDetails?.bedtpe,
        bookingType: submitType, // BOOK or HOLD
      };

      dispatch(setConfirmedBooking(finalBookingData));

      alert(
        submitType === "BOOK"
          ? "Payment deducted & booking confirmed!"
          : "Booking placed on hold successfully!"
      );

      router.replace(`/GetVoucher?bid=${encodeURIComponent(encrypted)}`);
    } catch (error) {
      setLoadingfetch(false);
      dispatch(setConfirmedBookingError(error.message));
      alert(error.message);
    }
  };

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

  function minusOneMinute(dateString) {
    const d = new Date(dateString);
    d.setMinutes(d.getMinutes() - 1);
    return formatDateTimeExact(d);
  }

  // function to get today Date and Time
  function getTodayDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;
  }

  function isPolicyExpired(policyList) {
    const now = new Date();

    return policyList.some((p) => new Date(p.FromDate) <= now);
  }

  const policyList =
    priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]
      ?.CancellationPolicyList || [];

  const expiredPolicy = isPolicyExpired(policyList);
  // const expiredPolicy = isPolicyExpired(policyList);

  return (
    <>
      <Header />
      {/* <div className="room-details">
      <p><strong>{hotel.rooms.length}</strong> room(s)</p>
      {hotel.rooms.map((room, index) => (
        <div key={index} style={{ fontSize: "13px", margin: "4px 0" }}>
          <p>
            Room {index + 1}: {room.adults} adult(s), {room.children} child(ren)
          </p>
          {room.children > 0 && (
            <p style={{ marginLeft: "10px", color: "gray" }}>
              Ages: {room.childrenAges && room.childrenAges.length > 0
                ? room.childrenAges.join(", ")
                : "Not specified"}
            </p>
          )}
        </div>
      ))}
    </div> */}

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

      {booking.Error && (
        <div>
          <p>{booking?.Error?.Message}</p>
        </div>
      )}

      <div className={styles.container}>
        {/* Left Form */}
        <form onSubmit={handleSubmits} className={styles.form} ref={formRef}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              padding: "10px 10px",
            }}
          >
            Guests Details & Payment
          </h2>

          {/* <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
</div>
          <div className={styles.row}>
  <div className={styles.countryGroup}>
    <CountrySelector
      selectedCountry={formData.countryCode}
      onCountrySelect={handleCountrySelect}
    />
  </div>

  <div className={`${styles.inputGroup} ${styles.phoneGroup}`}>
    <label>Phone Number *</label>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      required
    />
  </div>
</div>


          <div className={styles.inputGroup}>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div> */}

          {/* Show Room Number ONE TIME */}
          {guestForms.map((roomGuests, roomIndex) => {
            let adultCounter = 0;
            let childCounter = 0;

            return (
              <div key={roomIndex}>
                {/* ROOM LABEL */}
                <p className={styles.roomNum}>Room: {roomIndex + 1}</p>

                {roomGuests.map((guest, guestIndex) => {
                  // Count adults/children up to this guest
                  if (guest.type === "adult") adultCounter++;
                  if (guest.type === "child") childCounter++;

                  return (
                    <div key={guestIndex} className={styles.inputGroup}>
                      <h4
                        style={{ padding: "10px 0 0 5px", fontWeight: "bold" }}
                      >
                        {guest.type === "adult"
                          ? `Adult ${adultCounter}`
                          : `Child ${childCounter} (Age: ${guest.age})`}
                      </h4>

                      {/* NAME FIELDS */}
                      <div className={styles.row}>
                        <div className={styles.inputGroup}>
                          <input
                            type="text"
                            value={guest.firstName}
                            placeholder="First Name"
                            onChange={(e) =>
                              handleGuestChange(
                                roomIndex,
                                guestIndex,
                                "firstName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <input
                            type="text"
                            value={guest.lastName}
                            placeholder="Last Name"
                            onChange={(e) =>
                              handleGuestChange(
                                roomIndex,
                                guestIndex,
                                "lastName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* EXTRA FIELDS — ONLY FIRST ADULT OF EACH ROOM */}
                      {guest.type === "adult" &&
                        adultCounter === 1 &&
                        roomIndex === 0 && (
                          <>
                            <div
                              className={styles.row}
                              style={{ margin: "-8px 0 0 0" }}
                            >
                              {/* <div className={styles.countryGroup}>
                                <CountrySelector
                                  selectedCountry={formData.countryCode}
                                  show_label={false}
                                  placeholder={false}
                                  required
                                  onCountrySelect={(code) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      countryCode: code,
                                    }))
                                  }
                                />
                              </div> */}

                              <div className={styles.phoneWrapper} ref={dropdownRef}>
                              {/* Selected Country */}
                              <div
                                className={styles.countryDropdown}
                                onClick={() => setOpen(prev => !prev)}
                              >
                                <img
                                  src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
                                  alt={selectedCountry.name}
                                />
                                <div className={styles.countryText}>
    <span className={styles.countryCode}>{selectedCountry.code}</span>
    <span className={styles.countryName}>{selectedCountry.name}</span>
  </div>
  <span className={`${styles.arrow} ${open ? styles.rotate : ""}`}>
    ▾
  </span>

  
                              </div>

                            
  


                              {/* Dropdown */}
                              {open && (
                                <div className={styles.dropdownList}>
                                  {countryCodes.map((c) => (
                                    <div
                                      key={c.code}
                                      className={styles.countryOption}
                                      onClick={() => {
                                        const numberOnly = formData.phone.replace(formData.countryCode, "");

                                        setSelectedCountry(c);

                                        setFormData(prev => ({
                                          ...prev,
                                          countryCode: c.code,
                                          phone: c.code + numberOnly,
                                        }));

                                        setOpen(false);
                                      }}
                                    >
                                      <img src={`https://flagcdn.com/w40/${c.iso}.png`} />
                                      <span>{c.code}</span>
                                      <span>{c.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Phone Input */}
                              <input
                              maxLength={14}
                                type="tel"
                                className={styles.phoneInput}
                                placeholder="Phone Number"
                                value={formData.phone.replace(formData.countryCode, "")}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, "");
                                  setFormData(prev => ({
                                    ...prev,
                                    phone: prev.countryCode + digits,
                                  }));
                                }}
                                required
                              />
                            </div>

                            </div>

                            <div className={styles.inputGroup}>
                              <input
                             className={styles.mail}
                                type="Email Address"
                                placeholder="email"
                                value={formData.email}
                                required
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </>
                        )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <h3>Guests</h3>
          <div className={styles.toggle}>
            <button
              type="button"
              className={formData.guestType === "Myself" ? styles.active : ""}
              onClick={() =>
                setFormData((p) => ({ ...p, guestType: "Myself" }))
              }
            >
              Myself
            </button>
            <button
              type="button"
              className={
                formData.guestType === "Someone else" ? styles.active : ""
              }
              onClick={() =>
                setFormData((p) => ({ ...p, guestType: "Someone else" }))
              }
            >
              Someone else
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Any Special Request? (
              <span style={{ color: "red" }}>
                Special requests are subject to hotel availability and cannot be
                guaranteed.
              </span>
              )
            </label>

            <textarea
              name="specialRequest"
              value={formData.specialRequest}
              onChange={handleChange}
              placeholder="Enter request..."
            />
          </div>

          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleTermsCheckbox}
              required
            />
            <label>
              I Accept The{" "}
              <span
                onClick={() => setShowAmenitiesPopup(true)}
                style={{
                  color: "#528febff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Terms And Conditions
              </span>
            </label>
          </div>

          {/* <div className={styles.payment}>
            <p>Payment Method</p>
            <div className={styles.methods}>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                />
                <span style={{ marginRight: "8px" }}></span>Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple"
                  checked={formData.paymentMethod === "apple"}
                  onChange={handleChange}
                />
                <span style={{ marginRight: "8px" }}></span>Apple Pay
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gpay"
                  checked={formData.paymentMethod === "gpay"}
                  onChange={handleChange}
                />
                <span style={{ marginRight: "8px" }}></span>Google Pay
              </label>
            </div>
          </div> */}

          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            submit
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <button
              title="Pay as you go."
              type="button"
              className={styles.submitBtn}
              disabled={loadingfetch}
              onClick={() => {
                if (!formRef.current.checkValidity()) {
                  formRef.current.reportValidity();
                  return;
                }

                setSubmitType("BOOK");
                setPendingSubmitType("BOOK");
                setShowCancelModal(true);
              }}
            >
              Issue Booking
            </button>

            {!expiredPolicy && (
              <button
                type="button"
                className={styles.submitBtns}
                disabled={loadingfetch}
                onClick={() => {
                  if (!formRef.current.checkValidity()) {
                    formRef.current.reportValidity();
                    return;
                  }

                  setSubmitType("HOLD");
                  setPendingSubmitType("HOLD");
                  setShowCancelModal(true);
                }}
              >
                Hold & Book
              </button>
            )}
          </div>
        </form>

        {/* Right Summary */}
        <div className={styles.summary}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Booking Summary
          </h2>
          <div className={styles.hotelCard}>
            <img
              src={priceConfirmResponse?.image || "/no-image.jpg"}
              alt={hotel.name}
              className={styles.hotelImg}
              onError={(e) => {
                e.target.src =
                  "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
              }}
            />
            {/* <img src={priceConfirmResponse?.image} alt="Hotel" className={styles.hotelImg} /> */}
            <div>
              {/* ⭐ Rating Row */}
              {/* <div className={styles.rating}>
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaStar className={styles.star} />
        <FaRegStar className={styles.star} />
      </div> */}
              <div style={{ paddingBottom: "5px" }}>
                <StarRating rating={starRating} />
              </div>

              <h4 style={{ display: "flex", justifyContent: "flex-start" }}>
                {hotelName}
              </h4>
              <div className="loc-ico" style={{ display: "flex", gap: "5px" }}>
                <IoLocationOutline />
                <p style={{ marginTop: "-2px" }}>{location}</p>
              </div>

              {/* <p>Check-in: Sep 7, 2025</p>
      <p>Check-out: Sep 8, 2025</p>
      <p>Room 1 | 2 Adults</p>
      <p>Double or Twin Room</p>
      <p>BHD 33.550 per night</p> */}
            </div>
          </div>
          <div className={styles.totalBoxs}>
            <div className="check-ico" style={{ display: "flex", gap: "5px" }}>
              <IoCalendarOutline />
              <p style={{ marginTop: "-2px", color: "black" }}>
                Check-in & Check-out
              </p>
            </div>

            <p style={{ padding: "7px 0px 5px 1px", color: "#2c2c2cff" }}>
              {priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate.split(
                " "
              )[0] || ""}{" "}
              -{" "}
              {
                priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckOutDate.split(
                  " "
                )[0]
              }{" "}
              (
              {priceConfirmResponse?.nights > 1
                ? `${priceConfirmResponse?.nights} Nights`
                : `${priceConfirmResponse?.nights} Night`}
              )
            </p>
            <div
              className="selected-rooms"
              style={{
                margin: "0px 0px",
                // borderTop: "1px solid #ebebebff",
                // borderBottom: "1px solid #ebebebff",
                padding: "0px 0px",
              }}
            >
              {/* <h4>Selected Rooms:</h4> */}
              <div className="selected-rooms">
                {priceConfirmResponse?.room_cont?.length > 0 &&
                priceConfirmResponse?.parsedObject?.Success?.PriceDetails
                  ?.HotelList?.[0]?.RatePlanList ? (
                  priceConfirmResponse.room_cont.map((room, index) => {
                    const ratePlanList =
                      priceConfirmResponse.parsedObject.Success.PriceDetails
                        .HotelList[0].RatePlanList;

                    // Safe access for RoomName for each room
                    const roomName = ratePlanList?.[index]?.RoomName || "Room";

                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          padding: "5px 0",
                        }}
                      >
                        {/* ROOM INFO ROW */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Room Number */}
                          <div
                            style={{
                              backgroundColor: "#dcebecff",
                              padding: "4px 14px",
                              borderRadius: "30px",
                            }}
                          >
                            <p style={{ margin: 0, color: "black" }}>
                              Room {room.roomNum || index + 1}
                            </p>
                          </div>

                          {/* Adults */}
                          <p style={{ margin: 0, color: "black" }}>
                            {room.adults > 1
                              ? `${room.adults} Adults`
                              : `${room.adults} Adult`}
                          </p>

                          {/* Children + Ages */}
                          {room.children > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {room.childrenAges?.map((age, i) => (
                                <p
                                  key={i}
                                  style={{ margin: 0, color: "black" }}
                                >
                                  Child {i + 1} ({age}y)
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* ROOM NAME FROM RatePlanList */}
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            padding: "6px 0px 0px 4px",
                          }}
                        >
                          {roomName}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>No room data</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.totalBoxe}>
            <div className={styles.totalBox}>
              <h5>Total Cal.</h5>

              <p>
                {/* {convertPrice(hotel.roomCost)} {Bhdcurrency} / Night x{" "} */}
                {priceConfirmResponse?.room_cont?.length} Room(s) x{" "}
                {priceConfirmResponse?.nights} Night(s)
              </p>
            </div>
            <div className={styles.totalBoxee}>
              Total Amount
              <h4>
                {/* {(convertPrice(priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]?.TotalPrice))}{" "} */}
                {/* {convertPrice} {Bhdcurrency} */}
                {finalPrice.toFixed(2)} {"BHD"}
                {/* {" "}
                {convertPrice(
                  (hotel.roomCost * hotel.nights * hotel.totalRooms).toFixed(2)
                )}{" "}
                {Bhdcurrency} */}
              </h4>
            </div>
          </div>

          <div className={styles.policy}>
            <h4>Cancellation Policy</h4>

            {/* {priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.HotelList?.[0]?.CancellationPolicyList?.map(
              (policy, index) => (
                <div key={index}>
                  <p>Amount: {policy?.Amount}</p>
                  <p>From Date: {policy?.FromDate}</p>
                </div>
              )
            )} */}

            {!expiredPolicy ? (
              (() => {
                const policies = [...(policyList || [])].sort(
                  (a, b) => new Date(a.FromDate) - new Date(b.FromDate)
                );

                if (!policies.length) return null;

                return (
                  <div style={{ fontSize: 12, lineHeight: "1.6" }}>
                    {/* 1️⃣ NOW → first policy (FREE) */}
                    {/* 1️⃣ NOW → first policy (FREE) */}
                    <p>
                      Cancellation from {getTodayDateTime()} up to{" "}
                      {minusOneMinute(policies[0].FromDate)}{" "}
                      <strong>0 BHD</strong>
                    </p>

                    {/* 2️⃣ Middle ranges */}
                    {policies.length > 1 &&
                      policies.slice(1).map((p, i) => (
                        <p key={i}>
                          Cancellation from{" "}
                          {formatDateTimeExact(policies[i].FromDate)} up to{" "}
                          {minusOneMinute(p.FromDate)}{" "}
                          <strong>{policies[i].Amount} BHD</strong>
                        </p>
                      ))}

                    {/* 3️⃣ After last policy */}
                    <p>
                      Cancellation after{" "}
                      {formatDateTimeExact(
                        policies[policies.length - 1].FromDate
                      )}{" "}
                      <strong>
                        {policies[policies.length - 1].Amount} BHD
                      </strong>
                    </p>
                  </div>
                );
              })()
            ) : (
              <p style={{ color: "#c23d3d", fontSize: 12 }}>✖ Non-Refundable</p>
            )}
          </div>

          <div className={styles.policy}>
            <h4>Important Information</h4>
            <div
              style={{ fontSize: "15px", color: "#484848ff" }}
              dangerouslySetInnerHTML={{
                __html: Remark,
              }}
            />
          </div>
          {showAmenitiesPopup && (
            <div
              className={`popup-overlays ${animateClose ? "closing" : "open"}`}
            >
              <div
                className={`popup-content ${animateClose ? "closing" : "open"}`}
              >
                <div className="popup-inner">
                  {/* <TermsAndConditions/> */}
                  <div
                    className="term-txts"
                    style={{
                      margin: "20px 20px",
                      padding: "15px",
                      border: "1px solid silver",
                    }}
                  >
                    <h3
                      style={{
                        textAlign: "center",
                        fontSize: "17px",
                        padding: "0px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Terms And Conditions
                    </h3>
                    <hr style={{ color: "grey" }} />
                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Online Booking Process
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      All bookings must be made online to ensure a smooth and
                      efficient process.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Hotel Ratings and Classifications
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      Star ratings provide an overview of hotel quality,
                      facilities, services, and available amenities. However,
                      this rating system varies from country to country. For
                      example, a 5-star hotel in Paris may not have the same
                      level as a 5-star hotel in Berlin. CityIn Booking is not
                      responsible for hotel classifications and star ratings (*)
                      as they are provided to us and accepted in good faith.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Final User Name
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      It is important that the person making the booking enters
                      the correct names of all travelers. If "TEST," "TBA," or
                      any other abbreviation that does not match the actual
                      consumer's real name is entered as the guest name, the
                      hotel may refuse the booking. All travelers' names must be
                      entered, with the first name followed by the last name.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Minimum Age Requirement
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      At least one guest must be 18 years or older. If you book
                      a hotel in the United States and the travelers are under
                      25 years old, please contact the hotel directly for
                      clarification.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Room Types
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      The person making the booking is responsible for ensuring
                      that the booked room type is suitable for the traveling
                      group. If more guests arrive at the hotel than the room
                      capacity allows, the hotel has the right to refuse the
                      booking without a refund. The booked room type will be
                      provided, however, there may be occasions where a twin
                      room is allocated instead of a double bed room, or vice
                      versa. Please note that most European hotels provide two
                      (2) single beds joined together to form a double bed.
                      While all room type preferences are sent to the hotel,
                      room allocation is determined by the hotel and is subject
                      to availability at check-in.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Special Requests
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      Specific room types, smoking preferences, and bedding
                      arrangements for twin/double rooms cannot be guaranteed
                      and are subject to availability at check-in. It is always
                      guaranteed that the room provided by the hotel will
                      accommodate the number of booked travelers.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Late Check-in
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      If the client is expected to arrive after 18:00 (6 PM),
                      please contact the hotel and inform them of the client's
                      arrival time. Failure to inform the hotel of a late
                      arrival may result in the room being released.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Early Departure
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      Early departure refund requests must be accompanied by
                      early departure approval issued by the hotel. However,
                      early departure approval itself does not guarantee any
                      refund, and a refund can only be claimed if our
                      partner/hotel has not issued an invoice to us.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Booking Details
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      For online bookings, it is the user's responsibility to
                      verify and ensure the accuracy of all booking details
                      (such as traveler names and nationalities). The user must
                      also verify the final hotel address, hotel information,
                      city details, and country details on the service voucher.
                      The user must also read the cancellation or modification
                      policy that will apply to the booking. Once bookings are
                      confirmed, the cancellation, modification, or no-show
                      policy will be enforced. Hotels may impose additional or
                      incidental charges on customers, such as air conditioning,
                      a safe, a minibar, a rented television, and other
                      facilities. CityIn Booking has no control over these
                      charges, as well as parking fees, swimming pool, and spa
                      fees. These charges must be paid directly to the hotel.
                      The final user's nationality must be declared by selecting
                      "nationality" at the time of booking. This information
                      must match the final user's passport. False declaration of
                      the final user's nationality may result in consequences
                      that we cannot be held responsible for. If the user does
                      not change the final user's nationality, the system will
                      assume the default nationality.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Force Majeure
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      CityIn Booking is not responsible for any changes or
                      cancellations of hotel bookings due to force majeure
                      circumstances such as natural disasters, labor disputes,
                      illness, personal injury, or theft.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Resort Fees
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      Some hotels, especially in the United States, impose
                      "resort fees" that must be paid directly to the hotel.
                      These fees usually range between $10.00 to $20.00 per room
                      per night.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Duplicate Bookings
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      CityIn Booking does not guarantee or accept duplicate
                      bookings. If there are duplicate bookings in the system,
                      the user must modify one of them according to the
                      voucher's terms. Hotels may not agree to confirm duplicate
                      bookings, in which case, the responsibility falls on the
                      user.
                    </p>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Hotel Room Prices
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      We reserve the right to correct or modify mistakenly
                      entered prices in our system by the local agent. We will
                      offer you the option to retain the booking at the correct
                      prices, cancel the booking, or provide a suitable
                      alternative hotel based on availability.
                    </p>

                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      Cancellation and Refunds
                    </h1>
                    <div
                      className="lst-txt"
                      style={{
                        padding: "10px 0px",
                        fontSize: "16px",
                        color: "rgb(18, 18, 18)",
                      }}
                    >
                      <ul
                        style={{ listStyleType: "disc", paddingLeft: "20px" }}
                      >
                        <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
                          Cancellation policies are subject to the hotel’s
                          specific cancellation terms.
                        </li>
                        <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
                          Some bookings may be non-refundable, or cancellation
                          fees may apply.
                        </li>
                        <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
                          Users should review the cancellation policy of each
                          booking before confirming.
                          {/* {lange === "en" && (
              <div translate="no">
             
              </div>
              )} */}
                          {/* {lange === "ar" && (
              <div translate="no">
              يُرجى من المستخدمين مراجعة سياسة الإلغاء لكل حجز قبل تأكيده
              </div>
              )} */}
                        </li>
                      </ul>
                    </div>
                    <hr style={{ color: "#ccc" }} />

                    <h1
                      style={{
                        padding: "20px 0px 10px 0px",
                        fontWeight: "bold",
                      }}
                    >
                      General Terms and Conditions
                    </h1>
                    <p style={{ padding: "0px 0px 10px 0px" }}>
                      Our terms and conditions are available on our website. The
                      customer acknowledges that they have read them and accept
                      to adhere to them.
                    </p>

                    <div>
                      <button
                        style={{
                          backgroundColor: "#3378c2ff",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          float: "right",
                          cursor: "pointer",
                        }}
                        onClick={handleAcknowledge}
                      >
                        I Acknowledged
                      </button>

                      <button
                        className="close-btns"
                        onClick={() => setShowAmenitiesPopup(false)}
                      >
                        Close
                      </button>
                    </div>
                    <br />
                  </div>
                </div>
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
                  src="/booking.png"
                  alt="Loading"
                  width={50}
                  height={50}
                />
                <h2
                  style={{
                    fontWeight: "bold",
                    padding: "5px 0px",
                    fontSize: "19px",
                  }}
                >
                  {pendingSubmitType === "BOOK"
                    ? "Issue Booking Confirmation"
                    : "Hold Booking Confirmation"}
                </h2>
                <p>
                  You're going to{" "}
                  {pendingSubmitType === "BOOK" ? "confirm" : "hold"} your
                  "Booking"
                </p>

                <div className="modal-actions">
                  <button
                    className="btn"
                    onClick={() => setShowCancelModal(false)}
                  >
                    No, keep it.
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => {
                      setShowCancelModal(false);
                      submitRef.current.click(); // ✅ real form submit
                    }}
                  >
                    {pendingSubmitType === "BOOK"
                      ? "Yes, Confirm!"
                      : "Yes, Hold"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWarningPopup && (
            <div className="warning-popup-overlay">
              <div className="warning-popup-box">
                <div className="warning-popup-header">
                  <img
                    src="https://cdn-icons-gif.flaticon.com/11201/11201846.gif"
                    alt="Action Required"
                    style={{ width: "70px", height: "70px" }}
                  />
                  {/* <span className="warning-icon">⚠️</span>
        <h2>Action Required</h2> */}
                </div>

                <p className="warning-text">
                  You must acknowledge the Terms & Conditions before accepting.
                </p>

                <div className="warning-buttons">
                  <button
                    className="warning-btn terms-btn"
                    onClick={() => {
                      setShowWarningPopup(false);
                      setShowAmenitiesPopup(true);
                    }}
                  >
                    View Terms
                  </button>

                  <button
                    className="warning-btn close-btn"
                    onClick={() => {
                      setPopupClosing(true);
                      setTimeout(() => {
                        setShowAmenitiesPopup(false);
                        setPopupClosing(false);
                      }, 300);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// const handleSubmits = async (e) => { e.preventDefault();

//    const finalGuestList = guestForms.map((roomGuests, roomIndex) => { let adultIndex = 0; const guestInfo = roomGuests.map((g) => { let guest = { name: { first: g.firstName, last: g.lastName }, isAdult: g.isAdult, age: g.isAdult ? null : g.age, }; if (g.type === "adult") { adultIndex++; if (roomIndex === 0 && adultIndex === 1) { guest.name.first = formData.firstName || g.firstName; guest.name.last = formData.lastName || g.lastName; } } return guest; }); return { roomNum: roomIndex + 1, guestInfo, }; });
//    const bookingPayload = { checkInDate: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckInDate, checkOutDate: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.CheckOutDate, numOfRooms: priceConfirmResponse?.room_cont.length, guestList: finalGuestList, contact: { name: { first: "John", last: "Doe", }, email: "johndoe@example.com", phone: "+923001234567", }, clientReference: client-${Date.now() + 10000}, referenceNo: priceConfirmResponse?.parsedObject?.Success?.PriceDetails?.ReferenceNo, }; setLoadingfetch(true);
//     const res = await fetch("/api/walletDeduct", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderAmount: convertPrice(finalPrice), bookingPayload, }), }); const data = await res.json(); console.log("booking",data); setLoadingfetch(false); if (!data.success) { alert(data.message); return; } if(data.success){ const modidata={ ...data, agency:priceConfirmResponse?.agencyDetails } } alert(data?.message);
//      resetAllFields();
//      };
