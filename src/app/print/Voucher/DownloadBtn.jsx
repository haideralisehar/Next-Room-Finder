// "use client";
// import React, { useState, useEffect } from "react";
// import "../Voucher/voucher.css";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// export default function DownloadBtn({ booking, onAfterApiSuccess, onStatus }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [previewHtml, setPreviewHtml] = useState(null);
//   const [isHold, setisHold] = useState(false);
//   const [loadingfetch, setLoadingfetch] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showCancelModals, setshowCancelModals] = useState(false);
//   const [issued, setissued] = useState(null);
//   const [notissued, setnotissued] = useState(null);

//   useEffect(() => {
//     if (loading) {
//       document.body.style.overflow = "hidden";
//     } else {
//       setisHold(booking.isShow);
//       document.body.style.overflow = "auto";
//     }
//   }, [loading]);

//   useEffect(() => {
//     if (booking?.tableRows?.length) {
//       handleGenerate();
//     }
//   }, [booking?.tableRows]);

//   const handlePop = () => {
//     setshowCancelModals(true);
//   };

//   const handleIssueBooking = async () => {
//     try {
//       setLoadingfetch(true);

//       const res = await fetch("/api/issueUpdate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           agencyId: booking.agencyIds,
//           orderAmount: booking.price,
//           bookingID: booking.reference,
//           agencyname: booking.agencyname,
//           searchId: booking.searchId,
//           BookingID: booking.BookingID,
//           // trans_id: booking.trans_id,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setnotissued(data); // ✅ success
//         setissued(null);
//         setisHold(false);
//         onAfterApiSuccess();
//         onStatus();
//       } else {
//         setissued(data);
//         console.log(data.datas); // ❌ error
//         setnotissued(null);
//       }

//       setShowCancelModal(true);
//       return data;
//     } catch (error) {
//       setissued({ success: false, message: "Something went wrong" });
//       setnotissued(null);
//       setShowCancelModal(true);
//     } finally {
//       setLoadingfetch(false);
//     }
//   };

//   const handleGenerate = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch("/api/createVoucher", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           company: {
//             logo: booking.logo || "",
//             name: booking.agencyname,
//             phone: booking.agencyphone,
//             email: booking.agencyemail,
//             address: booking.agencyaddress,
//           },
//           hotel: {
//             name: booking.hotelName,
//             phone: booking.guestPhone,
//             address: booking.hotelAddress,
//           },
//           booking: {
//             reference: booking.reference,
//             arrival: booking.arrivalDate,
//             departure: booking.departureDate,
//           },
//           tableRows: booking.tableRows,
//           customer: {
//             requests: [booking.cmerreq],
//           },
//           reminders: [
//             "Upon your arrival please provide valid government-issued ID to the hotel front desk to locate the accurate booking.",
//             "Please tell front desk agent your preferred bed type if your booking comes with more than one (e.g. Double or Twin). The final arrangement is fully subject to hotel’s availability.",
//             "All special requests are not guaranteed. Please confirm your special requests with front desk upon arrival.",
//             "Check-in time starts at 15:00:00. Check-out time ends at 10:00:00. Please check-in before the latest check-in time displayed on the booking page. If no specific check-in time is indicated, please check-in before 9 PM on the first night. If you won't be able to arrive on the first night (No Show) or plan to check-in late, please contact the hotel in advance. Otherwise, the hotel may not notify guests in any way and may cancel the entire booking without refund.",
//             "Please be noted that some hotels charge children extra breakfast fee even when your room offers breakfast. The actual situation is subject to the hotel regulations.",
//             "Regular tax and fees are included in this stay. Addtional charges (City tax (Europe，Malaysia), resort fees, facility fees (North America), municipal fee (Dubai), tourism Tax (Malaysia), Sales and Service Tax(SST, Malaysia), etc.) may be charged directly by the hotel; Any other fees occured in the hotel such as addtional service fees, violation fines will also be charged by the hotel directly;",
//             "Front desk staff will greet guests on arrival at the property. The credit card used to book the reservation must be presented by the cardholder at check-in.",
//           ],
//         }),
//       });

//       const data = await response.json();
//       setPreviewHtml(data);
//     } catch (err) {
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   const downloadPDF = () => {
//     const link = document.createElement("a");
//     link.href = `data:application/pdf;base64,${previewHtml.pdf}`;
//     link.download = `${booking.reference}.pdf`;
//     link.click();

//     // router.replace("/");
//   };

//   return (
//     <div>
//       {loadingfetch && (
//         <div className="loading-container">
//           <div className="box">
//             <Image
//               className="circular-left-right"
//               src="/loading_ico.png"
//               alt="Loading"
//               width={200}
//               height={200}
//             />
//             <p style={{ fontSize: "13px" }}>Please Wait...</p>
//           </div>
//         </div>
//       )}

//       {/* <button
//         onClick={handleGenerate}
//         className="p-3 bg-blue-600 text-white rounded"
//         disabled={loading}
//       >
//         {loading ? "Generating..." : "Generate Voucher"}
//       </button> */}

//       {loading && (
//         <div className="loading-overlay">
//           <div className="spinner"></div>
//           <p className="loading-text">Generating Voucher</p>
//         </div>
//       )}

//       {previewHtml?.html && (
//         <div>
//           <div
//             className="fix"
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >
//             <div></div>

//             {/* <h2 className="text-xl font-bold ">Voucher Preview</h2> */}

//             {/* <img className="logo-img" src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png" alt="Cityin Booking" /> */}

//             <div style={{ display: "flex", gap: "6px" }}>
//               {isHold && (
//                 <button
//                   className="download-btn"
//                   style={{ backgroundColor: "#1367f7ff" }}
//                   onClick={handlePop}
//                 >
//                   Issue Booking
//                 </button>
//               )}

//               <button className="download-btn" onClick={downloadPDF}>
//                 Download
//               </button>
//             </div>
//           </div>

//           <div className="pdf-show">
//             {/* FIXED, ISOLATED, PERFECT PREVIEW */}
//             <iframe
//               key={Date.now()} // force reload
//               srcDoc={previewHtml.html} // render HTML directly
//               className="w-full"
//               style={{
//                 width: "100%",
//                 maxHeight: "1500px",
//                 height: "1300px",
//                 maxHeight:"2000px",
//                 border: "1px solid #ccc",
//                 background: "white",
//               }}
//               sandbox="allow-same-origin allow-scripts"
//             />
//           </div>
//         </div>
//       )}

//       {showCancelModals && (
//         <div className="modal-overlay">
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             <Image
//               style={{
//                 margin: "0px auto",
//               }}
//               // className="circular-left-right"
//               src="/booking.png"
//               alt="Loading"
//               width={50}
//               height={50}
//             />
//             <h2
//               style={{
//                 fontWeight: "bold",
//                 padding: "5px 0px",
//                 fontSize: "19px",
//               }}
//             >
//               Booking Confirmation
//             </h2>
//             <p>You're going to issue your "Booking"</p>

//             <div className="modal-actions">
//               <button
//                 className="btn"
//                 onClick={() => setshowCancelModals(false)}
//               >
//                 No, keep it.
//               </button>

//               <button
//                 className="btne dangere"
//                 onClick={() => {
//                   handleIssueBooking();
//                   setshowCancelModals(false);
//                 }}
//               >
//                 Yes, Issue!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showCancelModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowCancelModal(false)}
//         >
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             {notissued?.success && (
//               <Image
//                 style={{
//                   margin: "0px auto",
//                 }}
//                 // className="circular-left-right"
//                 src="/checked.png"
//                 alt="Loading"
//                 width={40}
//                 height={40}
//               />
//             )}

//             {issued && issued.success === false && (
//               <Image
//                 style={{
//                   margin: "0px auto",
//                 }}
//                 // className="circular-left-right"
//                 src="/close.png"
//                 alt="Loading"
//                 width={40}
//                 height={40}
//               />
//             )}
//             {/* Success */}
//             {notissued?.success && (
//               <>
//                 <h2
//                   style={{
//                     fontWeight: "bold",
//                     padding: "5px 0",
//                     fontSize: "19px",
//                   }}
//                 >
//                   Issue Confirmation
//                 </h2>
//                 <p>{notissued.message}</p>
//               </>
//             )}

//             {/* Error */}
//             {issued && issued.success === false && (
//               <>
//                 <h2
//                   style={{
//                     fontWeight: "bold",
//                     padding: "5px 0",
//                     fontSize: "19px",
//                   }}
//                 >
//                   Error Occurred
//                 </h2>
//                 <p>{issued.message}</p>
//               </>
//             )}

//             <div className="modal-actions">
//               <button className="btn" onClick={() => setShowCancelModal(false)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from "react";
import "../Voucher/voucher.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function DownloadBtn({ booking, onAfterApiSuccess, onStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [isHold, setisHold] = useState(false);
  const [loadingfetch, setLoadingfetch] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelModals, setshowCancelModals] = useState(false);
  const [issued, setissued] = useState(null);
  const [notissued, setnotissued] = useState(null);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      setisHold(booking.isShow);
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  useEffect(() => {
    if (booking?.tableRows?.length) {
      handleGenerate();
    }
  }, [booking?.tableRows]);

  const handlePop = () => {
    setshowCancelModals(true);
  };

  const handleIssueBooking = async () => {
    try {
      setLoadingfetch(true);

      const res = await fetch("/api/issueUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencyId: booking.agencyIds,
          orderAmount: booking.price,
          bookingID: booking.reference,
          agencyname: booking.agencyname,
          searchId: booking.searchId,
          BookingID: booking.BookingID,
          // trans_id: booking.trans_id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setnotissued(data); // ✅ success
        setissued(null);
        setisHold(false);
        // onAfterApiSuccess();
        // onStatus();
      } else {
        setissued(data);
        console.log(data.datas); // ❌ error
        setnotissued(null);
      }

      setShowCancelModal(true);
      return data;
    } catch (error) {
      setissued({ success: false, message: "Something went wrong" });
      setnotissued(null);
      setShowCancelModal(true);
    } finally {
      setLoadingfetch(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/createVoucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: {
            logo: booking.logo,
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
          <div
            className="fix"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div></div>

            {/* <h2 className="text-xl font-bold ">Voucher Preview</h2> */}

            {/* <img className="logo-img" src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png" alt="Cityin Booking" /> */}

            <div style={{ display: "flex", gap: "6px" }}>
              {isHold && (
                <button
                  className="download-btn"
                  style={{ backgroundColor: "#1367f7ff" }}
                  onClick={handlePop}
                >
                  Issue Booking
                </button>
              )}

              <button className="download-btn" onClick={downloadPDF}>
                Download
              </button>
            </div>
          </div>

          <div className="pdf-show">
            {/* FIXED, ISOLATED, PERFECT PREVIEW */}
            <iframe
              key={Date.now()} // force reload
              srcDoc={previewHtml.html} // render HTML directly
              className="w-full"
              style={{
                width: "100%",
                maxHeight: "1500px",
                height: "1300px",
                maxHeight:"2000px",
                border: "1px solid #ccc",
                background: "white",
              }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      )}

      {showCancelModals && (
        <div className="modal-overlay">
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
              Booking Confirmation
            </h2>
            <p>You're going to issue your "Booking"</p>

            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setshowCancelModals(false)}
              >
                No, keep it.
              </button>

              <button
                className="btne dangere"
                onClick={() => {
                  handleIssueBooking();
                  setshowCancelModals(false);
                }}
              >
                Yes, Issue!
              </button>
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
            {notissued?.success && (
              <Image
                style={{
                  margin: "0px auto",
                }}
                // className="circular-left-right"
                src="/checked.png"
                alt="Loading"
                width={40}
                height={40}
              />
            )}

            {issued && issued.success === false && (
              <Image
                style={{
                  margin: "0px auto",
                }}
                // className="circular-left-right"
                src="/close.png"
                alt="Loading"
                width={40}
                height={40}
              />
            )}
            {/* Success */}
            {notissued?.success && (
              <>
                <h2
                  style={{
                    fontWeight: "bold",
                    padding: "5px 0",
                    fontSize: "19px",
                  }}
                >
                  Issue Confirmation
                </h2>
                <p>{notissued.message}</p>
              </>
            )}

            {/* Error */}
            {issued && issued.success === false && (
              <>
                <h2
                  style={{
                    fontWeight: "bold",
                    padding: "5px 0",
                    fontSize: "19px",
                  }}
                >
                  Error Occurred
                </h2>
                <p>{issued.message}</p>
              </>
            )}

            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCancelModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
