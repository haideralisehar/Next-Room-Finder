"use client";
import React, { useState,useEffect } from "react";
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

export default function BookingPage() {
  const { Bhdcurrency, convertPrice } = useBhdCurrency();
  const searchParams = useSearchParams();
  const [showAmenitiesPopup, setShowAmenitiesPopup] = useState(false);

  const [acknowledged, setAcknowledged] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
  const storedAck = localStorage.getItem("acknowledged");
  if (storedAck === "true") {
    setAcknowledged(true);
  }
}, []);

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
    price: searchParams.get("price"),
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

  const rume = JSON.stringify(hotel.rooms);

  // console.log("Hotel Data:", hotel.SelectedRoom);

  // Calculate total price of selected rooms
  const totalPrice = hotel.SelectedRoom.reduce((acc, room) => {
    return acc + Number(room.price); // Convert price to number just in case
  }, 0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+973 Bahrain",
    phone: "",
    email: "",
    guestType: "Myself",
    specialRequest: "",
    termsAccepted: false,
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API call here
  };

  const parseDate = (str) => {
    const [day, month, year] = str.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

      <div className={styles.container}>
        {/* Left Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Guests Details & Payment
          </h2>

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

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Country Code *</label>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="+973 Bahrain">+973 Bahrain</option>
                <option value="+92 Pakistan">+92 Pakistan</option>
                <option value="+91 India">+91 India</option>
                <option value="+1 USA">+1 USA</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
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
          </div>

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
            <label>Any Special Request?</label>
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


          <div className={styles.payment}>
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
          </div>

          <button type="submit" className={styles.submitBtn}>
            Proceed To Pay
          </button>
        </form>

        {/* Right Summary */}
        <div className={styles.summary}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Booking Summary
          </h2>
          <div className={styles.hotelCard}>
            <img src={hotel.image} alt="Hotel" className={styles.hotelImg} />
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
                <StarRating rating={hotel.rating} />
              </div>

              <h4 style={{ display: "flex", justifyContent: "flex-start" }}>
                {hotel.name}
              </h4>
              <div className="loc-ico" style={{ display: "flex", gap: "5px" }}>
                <IoLocationOutline />
                <p style={{ marginTop: "-2px" }}>{hotel.location}</p>
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
              {hotel.from ? formatDate(hotel.from) : "N/A"} -{" "}
              {hotel.to ? formatDate(hotel.to) : "N/A"} (
              {hotel.nights > 1
                ? `${hotel.nights} Nights`
                : `${hotel.nights} Night`}
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
                {/* <h4>Selected Rooms:</h4> */}
                {hotel.rooms.length > 0 && hotel.SelectedRoom.length > 0 ? (
                  hotel.rooms.map((r, i) => {
                    const selectedRoomData = hotel.SelectedRoom[i]; // Match by index
                    return (
                      <div key={i} style={{ padding: "5px 0px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            borderTop: "1px solid #ebebeb",
                            paddingTop: "15px",
                            paddingBottom: "0px",
                          }}
                        >
                          {/* Room number & guest info */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#dcebecff",
                                padding: "0.5px 10px",
                                borderRadius: "30px",
                              }}
                            >
                              <p style={{ color: "black" }}>Room {i + 1}</p>
                            </div>

                            <p style={{ color: "black" }}>
                              {r.adults > 1
                                ? `${r.adults} Adults`
                                : `${r.adults} Adult`}
                            </p>

                            {r.children > 0 && (
                              <ul
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  listStyle: "none",
                                  padding: 0,
                                  margin: 0,
                                  flexWrap: "wrap",
                                }}
                              >
                                {r.childrenAges?.map((age, idx) => (
                                  <p key={idx} style={{ color: "black" }}>
                                    {idx + 1} Child ({age}y)
                                  </p>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Room title & price */}
                          {selectedRoomData && (
                            <div style={{ marginTop: "10px" }}>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: "black",
                                  paddingBottom: "10px",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                }}
                              >
                                {selectedRoomData.roomName} (
                                {selectedRoomData.mealPlan})
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                }}
                              >
                                <p>
                                  {convertPrice(selectedRoomData.price)}{" "}
                                  {Bhdcurrency} per night
                                </p>
                                <p
                                  style={{ fontWeight: "bold", color: "black" }}
                                >
                                  {convertPrice(selectedRoomData.price)}{" "}
                                  {Bhdcurrency}
                                  {/* {hotel.roomprice}</p> */}{" "}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No rooms selected</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.totalBoxe}>
            <div className={styles.totalBox}>
              <h5>Total Cal.</h5>
              <p>
                {/* {convertPrice(hotel.roomCost)} {Bhdcurrency} / Night x{" "} */}
                {hotel.totalRooms} Room(s) x {hotel.nights} Night(s)
              </p>
            </div>
            <div className={styles.totalBoxee}>
              Total Amount
              <h4>
                {(convertPrice(totalPrice) * hotel.nights).toFixed(2)}{" "}
                {Bhdcurrency}
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
            <p>Non-Refundable</p>
          </div>

          <div className={styles.policy}>
            <h4>Important Information</h4>
            <p>No extra info shared by Hotel.</p>
          </div>
          {showAmenitiesPopup && (
            <div className="popup-overlays">
              <div className="popup-content">
                {/* <TermsAndConditions/> */}
                <div
                  className="term-txt"
                  // style={{
                  //   maxWidth: "98%",
                  //   margin: "20px 20px",
                  //   padding: "15px",
                  //   border: "1px solid silver",
                  // }}
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
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Online Booking Process
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    All bookings must be made online to ensure a smooth and
                    efficient process.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Hotel Ratings and Classifications
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    Star ratings provide an overview of hotel quality,
                    facilities, services, and available amenities. However, this
                    rating system varies from country to country. For example, a
                    5-star hotel in Paris may not have the same level as a
                    5-star hotel in Berlin. CityIn Booking is not responsible
                    for hotel classifications and star ratings (*) as they are
                    provided to us and accepted in good faith.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Final User Name
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    It is important that the person making the booking enters
                    the correct names of all travelers. If "TEST," "TBA," or any
                    other abbreviation that does not match the actual consumer's
                    real name is entered as the guest name, the hotel may refuse
                    the booking. All travelers' names must be entered, with the
                    first name followed by the last name.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Minimum Age Requirement
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    At least one guest must be 18 years or older. If you book a
                    hotel in the United States and the travelers are under 25
                    years old, please contact the hotel directly for
                    clarification.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Room Types
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    The person making the booking is responsible for ensuring
                    that the booked room type is suitable for the traveling
                    group. If more guests arrive at the hotel than the room
                    capacity allows, the hotel has the right to refuse the
                    booking without a refund. The booked room type will be
                    provided, however, there may be occasions where a twin room
                    is allocated instead of a double bed room, or vice versa.
                    Please note that most European hotels provide two (2) single
                    beds joined together to form a double bed. While all room
                    type preferences are sent to the hotel, room allocation is
                    determined by the hotel and is subject to availability at
                    check-in.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Special Requests
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    Specific room types, smoking preferences, and bedding
                    arrangements for twin/double rooms cannot be guaranteed and
                    are subject to availability at check-in. It is always
                    guaranteed that the room provided by the hotel will
                    accommodate the number of booked travelers.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Late Check-in
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    If the client is expected to arrive after 18:00 (6 PM),
                    please contact the hotel and inform them of the client's
                    arrival time. Failure to inform the hotel of a late arrival
                    may result in the room being released.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Early Departure
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    Early departure refund requests must be accompanied by early
                    departure approval issued by the hotel. However, early
                    departure approval itself does not guarantee any refund, and
                    a refund can only be claimed if our partner/hotel has not
                    issued an invoice to us.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Booking Details
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    For online bookings, it is the user's responsibility to
                    verify and ensure the accuracy of all booking details (such
                    as traveler names and nationalities). The user must also
                    verify the final hotel address, hotel information, city
                    details, and country details on the service voucher. The
                    user must also read the cancellation or modification policy
                    that will apply to the booking. Once bookings are confirmed,
                    the cancellation, modification, or no-show policy will be
                    enforced. Hotels may impose additional or incidental charges
                    on customers, such as air conditioning, a safe, a minibar, a
                    rented television, and other facilities. CityIn Booking has
                    no control over these charges, as well as parking fees,
                    swimming pool, and spa fees. These charges must be paid
                    directly to the hotel. The final user's nationality must be
                    declared by selecting "nationality" at the time of booking.
                    This information must match the final user's passport. False
                    declaration of the final user's nationality may result in
                    consequences that we cannot be held responsible for. If the
                    user does not change the final user's nationality, the
                    system will assume the default nationality.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
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
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Resort Fees
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    Some hotels, especially in the United States, impose "resort
                    fees" that must be paid directly to the hotel. These fees
                    usually range between $10.00 to $20.00 per room per night.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Duplicate Bookings
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    CityIn Booking does not guarantee or accept duplicate
                    bookings. If there are duplicate bookings in the system, the
                    user must modify one of them according to the voucher's
                    terms. Hotels may not agree to confirm duplicate bookings,
                    in which case, the responsibility falls on the user.
                  </p>
                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    Hotel Room Prices
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    We reserve the right to correct or modify mistakenly entered
                    prices in our system by the local agent. We will offer you
                    the option to retain the booking at the correct prices,
                    cancel the booking, or provide a suitable alternative hotel
                    based on availability.
                  </p>

                  <hr style={{ color: "#ccc" }} />

                  <h1
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
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
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
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
                    style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}
                  >
                    General Terms and Conditions
                  </h1>
                  <p style={{ padding: "0px 0px 10px 0px" }}>
                    Our terms and conditions are available on our website. The
                    customer acknowledges that they have read them and accept to
                    adhere to them.
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
                    onClick={() => setShowWarningPopup(false)}
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
