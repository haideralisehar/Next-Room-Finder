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
            requests: ["No smoking room", "Late checkout"],
          },
          reminders: [
            "Bring passport",
            "Present voucher on arrival",
            "Early check-in subject to availability",
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

    router.replace("/");
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
