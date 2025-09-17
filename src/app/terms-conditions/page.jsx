"use client";
import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../terms-conditions/terms.css"

export default function TermsAndConditions() {
   const [lange, setLange] = useState("");
  
    useEffect(() => {
      // Load saved language from localStorage
      const saved = localStorage.getItem("preferred_lang");
      if (saved) setLange(saved);
      
      
    }, []);
  
  return (
    <div>
      <Header />

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
            fontWeight:"bold"
          }}
        >
          Terms And Conditions
        </h3>
        <hr style={{ color: "grey" }} />
        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold",  }}>
          Online Booking Process
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          All bookings must be made online to ensure a smooth and efficient
          process.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Hotel Ratings and Classifications
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Star ratings provide an overview of hotel quality, facilities,
          services, and available amenities. However, this rating system varies
          from country to country. For example, a 5-star hotel in Paris may not
          have the same level as a 5-star hotel in Berlin. CityIn Booking is not
          responsible for hotel classifications and star ratings (*) as they are
          provided to us and accepted in good faith.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Final User Name
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          It is important that the person making the booking enters the correct
          names of all travelers. If "TEST," "TBA," or any other abbreviation
          that does not match the actual consumer's real name is entered as the
          guest name, the hotel may refuse the booking. All travelers' names
          must be entered, with the first name followed by the last name.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Minimum Age Requirement
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          At least one guest must be 18 years or older. If you book a hotel in
          the United States and the travelers are under 25 years old, please
          contact the hotel directly for clarification.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Room Types
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          The person making the booking is responsible for ensuring that the
          booked room type is suitable for the traveling group. If more guests
          arrive at the hotel than the room capacity allows, the hotel has the
          right to refuse the booking without a refund. The booked room type
          will be provided, however, there may be occasions where a twin room is
          allocated instead of a double bed room, or vice versa. Please note
          that most European hotels provide two (2) single beds joined together
          to form a double bed. While all room type preferences are sent to the
          hotel, room allocation is determined by the hotel and is subject to
          availability at check-in.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Special Requests
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Specific room types, smoking preferences, and bedding arrangements for
          twin/double rooms cannot be guaranteed and are subject to availability
          at check-in. It is always guaranteed that the room provided by the
          hotel will accommodate the number of booked travelers.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Late Check-in
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          If the client is expected to arrive after 18:00 (6 PM), please contact
          the hotel and inform them of the client's arrival time. Failure to
          inform the hotel of a late arrival may result in the room being
          released.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Early Departure
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Early departure refund requests must be accompanied by early departure
          approval issued by the hotel. However, early departure approval itself
          does not guarantee any refund, and a refund can only be claimed if our
          partner/hotel has not issued an invoice to us.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Booking Details
        </h1>
        <p style={{ padding: "0px 0px 10px 0px"}}>
          For online bookings, it is the user's responsibility to verify and
          ensure the accuracy of all booking details (such as traveler names and
          nationalities). The user must also verify the final hotel address,
          hotel information, city details, and country details on the service
          voucher. The user must also read the cancellation or modification
          policy that will apply to the booking. Once bookings are confirmed,
          the cancellation, modification, or no-show policy will be enforced.
          Hotels may impose additional or incidental charges on customers, such
          as air conditioning, a safe, a minibar, a rented television, and other
          facilities. CityIn Booking has no control over these charges, as well
          as parking fees, swimming pool, and spa fees. These charges must be
          paid directly to the hotel. The final user's nationality must be
          declared by selecting "nationality" at the time of booking. This
          information must match the final user's passport. False declaration of
          the final user's nationality may result in consequences that we cannot
          be held responsible for. If the user does not change the final user's
          nationality, the system will assume the default nationality.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Force Majeure
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          CityIn Booking is not responsible for any changes or cancellations of
          hotel bookings due to force majeure circumstances such as natural
          disasters, labor disputes, illness, personal injury, or theft.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Resort Fees
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Some hotels, especially in the United States, impose "resort fees"
          that must be paid directly to the hotel. These fees usually range
          between $10.00 to $20.00 per room per night.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Duplicate Bookings
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          CityIn Booking does not guarantee or accept duplicate bookings. If
          there are duplicate bookings in the system, the user must modify one
          of them according to the voucher's terms. Hotels may not agree to
          confirm duplicate bookings, in which case, the responsibility falls on
          the user.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Hotel Room Prices
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          We reserve the right to correct or modify mistakenly entered prices in
          our system by the local agent. We will offer you the option to retain
          the booking at the correct prices, cancel the booking, or provide a
          suitable alternative hotel based on availability.
        </p>
        
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
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
              Cancellation policies are subject to the hotel’s specific cancellation terms.
            </li>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              Some bookings may be non-refundable, or cancellation fees may apply.
            </li>
            <li style={{ marginBottom: "8px", lineHeight: "1.6" }}>
              {lange === "en" && (
              <div translate="no">
              Users should review the cancellation policy of each booking before confirming.
              </div>
              )}

              {lange === "ar" && (
              <div translate="no">
              يُرجى من المستخدمين مراجعة سياسة الإلغاء لكل حجز قبل تأكيده
              </div>
              )}
            
            </li>
            
          </ul>
        </div>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          General Terms and Conditions
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Our terms and conditions are available on our website. The customer
          acknowledges that they have read them and accept to adhere to them.
        </p>
        

         



          


      </div>

      <Footer />
    </div>
  );
}
