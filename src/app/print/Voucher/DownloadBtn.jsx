"use client";
import React, { useState, useEffect } from "react";
import "../Voucher/voucher.css"
import { useRouter } from "next/navigation";
export default function DownloadBtn({ booking }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);

  useEffect(() => {
  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [loading]);


   useEffect(() => {
  if (booking?.tableRows?.length) {
    handleGenerate();
  }
}, [booking?.tableRows]);


  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/createVoucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: {
            logo: "/logo.png",
            name: booking.agencyname,
            phone: booking.agencyphone,
            email: booking.agencyemail,
            address: booking.agencyaddress,
          },
          hotel: {
            name: booking.hotelName,
            phone: booking.guestPhone,
            address: booking.hotelAddress,
          },
          booking: {
            reference: booking.reference,
            arrival: booking.arrivalDate,
            departure: booking.departureDate,
          },
          tableRows: booking.tableRows,
          customer: {
            requests: [booking.cmerreq],
          },
          reminders: [
            "Upon your arrival please provide valid government-issued ID to the hotel front desk to locate the accurate booking.",
            "Please tell front desk agent your preferred bed type if your booking comes with more than one (e.g. Double or Twin). The final arrangement is fully subject to hotel’s availability.",
            "All special requests are not guaranteed. Please confirm your special requests with front desk upon arrival.",
            "Check-in time starts at 15:00:00. Check-out time ends at 10:00:00. Please check-in before the latest check-in time displayed on the booking page. If no specific check-in time is indicated, please check-in before 9 PM on the first night. If you won't be able to arrive on the first night (No Show) or plan to check-in late, please contact the hotel in advance. Otherwise, the hotel may not notify guests in any way and may cancel the entire booking without refund.",
            "Please be noted that some hotels charge children extra breakfast fee even when your room offers breakfast. The actual situation is subject to the hotel regulations.",
            "Regular tax and fees are included in this stay. Addtional charges (City tax (Europe，Malaysia), resort fees, facility fees (North America), municipal fee (Dubai), tourism Tax (Malaysia), Sales and Service Tax(SST, Malaysia), etc.) may be charged directly by the hotel; Any other fees occured in the hotel such as addtional service fees, violation fines will also be charged by the hotel directly;",
            "Front desk staff will greet guests on arrival at the property. The credit card used to book the reservation must be presented by the cardholder at check-in.",
           
            
          ],
        }),
      });

      const data = await response.json();
      setPreviewHtml(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${previewHtml.pdf}`;
    link.download = `${booking.reference}.pdf`;
    link.click();

    // router.replace("/");
  };

  return (
    <div>
      {/* <button
        onClick={handleGenerate}
        className="p-3 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Voucher"}
      </button> */}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Generating Voucher</p>
        </div>
      )}


      {previewHtml?.html && (
        <div>
          <div className="fix" style={{display:"flex", justifyContent:"space-between"}}>


          
          {/* <h2 className="text-xl font-bold ">Voucher Preview</h2> */}

          <img className="logo-img" src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png" alt="Cityin Booking" />

          <button className="download-btn"
            onClick={downloadPDF}
            
          >
            Download
            
          </button>
          </div>
          
          <div className="pdf-show">

          {/* FIXED, ISOLATED, PERFECT PREVIEW */}
          <iframe
            key={Date.now()}               // force reload
            srcDoc={previewHtml.html}       // render HTML directly
            className="w-full"
            style={{
              width:"100%",
              height: "1200px",
              border: "1px solid #ccc",
              background: "white",
            }}
            sandbox="allow-same-origin allow-scripts"
          />
          </div>

          
        </div>
      )}
    </div>
  );
}
