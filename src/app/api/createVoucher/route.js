// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { chromium as playwrightChromium } from "playwright-core";
// import lambdaChromium from "@sparticuz/chromium";

// const isVercel = !!process.env.VERCEL;

// export async function POST(req) {
//   try {
//     const payload = await req.json();

//     const {
//       company,
//       hotel,
//       booking,
//       tableRows,
//       customer,
//       reminders,
//     } = payload;

//         const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <style>
//   body{
//   font-family: Arial, sans-serif
//   }
  
// .company-logo{
//     // background-color: rgb(28, 28, 173);
//     padding: 30px 10px;
//     border-radius: 6px;
// }

// /* Main Container */
// .voucher-wrapper {
//   // max-width: 900px;
//   width: 100%;
//   height:auto;
//   margin: 0 auto;
//   background: #fff;
//   padding: 25px;

//   color: #000;
//   // border: 1px solid #dcdcdc;
//   box-sizing: border-box;
// }

// /* Header */
// .voucher-header {
//   border: 1px solid #bfbfbf;
//   padding: 15px;
//   display: flex;
//   align-items: center;
//   gap: 20px;
//   flex-wrap: wrap;
// }

// .company-logo img {
//   width: 120px;
//   max-width: 100%;
// }

// .company-info p {
//   margin: 3px 0;
//   font-size: 14px;
// }

// /* Title */
// .voucher-title {
//   margin-top: 25px;
//   font-size: 22px;
//   font-weight: bold;
//   text-align: center;
// }

// .voucher-subtitle {
//   text-align: center;
//   font-size: 13px;
//   margin-bottom: 25px;
// }

// /* Section */
// .section {
//   margin-top: 25px;
//   border: 1px solid #ccc;
// }

// .section-heading {
//   background: #f2f2f2;
//   padding: 10px 12px;
//   font-weight: bold;
//   border-bottom: 1px solid #ccc;
// }

// /* Content */
// .hotel-info,
// .customer-requests,
// .reminder-section {
//   padding: 12px 15px;
// }

// /* Order grid */
// .order-grid {
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   gap: 15px;
//   padding: 12px 15px;
// }

// .order-grid div {
//   flex: 1;
//   min-width: 180px;
// }

// .order-grid .label {
//   font-size: 12px;
//   color: #555;
// }

// .order-grid .value {
//   font-size: 14px;
//   font-weight: bold;
// }

// /* Table */
// .order-table {
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 10px;
// }

// .order-table th,
// .order-table td {
//   border: 1px solid #d1d1d1;
//   padding: 8px 10px;
//   text-align: left;
//   font-size: 14px;
// }

// .order-table th {
//   background: #f5f5f5;
// }

// /* Table responsive */
// .order-table-wrapper {
//   width: 100%;
//   overflow-x: auto;
// }

// .order-table {
//   min-width: 600px;
// }

// /* Reminder list */
// .reminder-section ol {
//   padding-left: 18px;
// }

// .reminder-section li {
//   margin-bottom: 6px;
//   font-size: 14px;
// }

// /* -------- RESPONSIVE BREAKPOINTS -------- */

// /* Tablets */
// @media (max-width: 768px) {
//   .voucher-wrapper {
//     padding: 15px;
//   }

//   .voucher-header {
//     flex-direction: column;
//     text-align: center;
//   }

//   .voucher-title {
//     font-size: 20px;
//   }
// }

// /* Mobile */
// @media (max-width: 480px) {
//   .voucher-wrapper {
//     padding: 12px;
//   }

//   .voucher-title {
//     font-size: 18px;
//   }

//   .company-info p,
//   .hotel-info p,
//   .customer-requests p,
//   .reminder-section li {
//     font-size: 13px;
//   }

//   .order-grid div {
//     min-width: 100%;
//   }

//   .order-table th,
//   .order-table td {
//     font-size: 12px;
//     padding: 6px;
//   }
// }

//   </style>
// </head>
// <body>
// <div class="voucher-wrapper">

//   <div class="voucher-header">
//     <div class="company-logo">
//       <img src=${company.logo} width="120" />
//     </div>
//     <div class="company-info">
//       <p><strong>Company Name:</strong> ${company.name}</p>
//       <p><strong>Tel:</strong> ${company.phone}</p>
//       <p><strong>Email:</strong> ${company.email}</p>
//       <p><strong>Addr:</strong> ${company.address}</p>
//     </div>
//   </div>

//   <h2 class="voucher-title">HOTEL VOUCHER</h2>
//   <p class="voucher-subtitle">PLEASE PRESENT THIS VOUCHER UPON ARRIVAL.</p>

//   <div class="section">
//     <div class="section-heading">Hotel Information</div>
//     <div class="hotel-info">
//       <p class="hotel-name"><strong>${hotel.name}</strong></p>
//       <p><strong>Tel.</strong> ${hotel.phone}</p>
//       <p><strong>Ads.</strong> ${hotel.address}</p>
//     </div>
//   </div>

//   <div class="section">
//     <div class="section-heading">Order Information</div>

//     <div class="order-grid">
//       <div>
//         <p class="label">Reference Number</p>
//         <p class="value">${booking.reference}</p>
//       </div>
//       <div>
//         <p class="label">Arrival Date</p>
//         <p class="value">${booking.arrival}</p>
//       </div>
//       <div>
//         <p class="label">Departure Date</p>
//         <p class="value">${booking.departure}</p>
//       </div>
//     </div>

//     <div class="order-table-wrapper">
//     <table class="order-table">
//       <thead>
//         <tr>
//           <th>Unit</th>
//           <th>Room Type / Bed Type</th>
//           <th>Guests</th>
//           <th>Number</th>
//           <th>Meal Type</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${tableRows
//           .map(
//             (row, index) => `
//           <tr>
//             <td>${index + 1}</td>
//             <td>${row.roomType}<br>${row.bedType}</td>
//             <td>${row.guestName}</td>
//             <td>${row.number}</td>
//             <td>${row.mealType}</td>
//           </tr>
//         `
//           )
//           .join("")}
//       </tbody>
//     </table>
//     </div>

//     <div class="customer-requests">
//       <p><strong>* Customer Requests</strong></p>
//       ${customer.requests.map((r) => `<p>${r}</p>`).join("")}
//       <p class="note">The remarks for the establishment are for reference only. We cannot guarantee them.</p>
//     </div>
//   </div>

//   <div class="section reminder-section">
//     <p class="reminder-title"><strong>Reminder:</strong></p>
//     <ol>
//       ${reminders.map((r) => `<li>${r}</li>`).join("")}
//     </ol>
//   </div>
// </div>
// </body>
// </html>
// `;

//     // -------------------------------
//     // Launch Browser (ENV AWARE)
//     // -------------------------------
//     const browser = await playwrightChromium.launch(
//       isVercel
//         ? {
//             args: lambdaChromium.args,
//             executablePath: await lambdaChromium.executablePath(),
//             headless: lambdaChromium.headless,
//           }
//         : {
//             headless: true, // Local Playwright browser
//           }
//     );

//     const page = await browser.newPage();

//     await page.setContent(html, {
//       waitUntil: "networkidle",
//     });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     return NextResponse.json({
//   success: true,
//   html,
//   pdf: Buffer.from(pdfBuffer).toString("base64"),
// });
//   } catch (err) {
//     console.error("VOUCHER ERROR:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to generate voucher" },
//       { status: 500 }
//     );
//   }
// }


export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { chromium as playwrightChromium } from "playwright-core";
import lambdaChromium from "@sparticuz/chromium";

const isVercel = !!process.env.VERCEL;

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      company,
      hotel,
      booking,
      tableRows,
      customer,
      reminders,
    } = payload;

        const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
  body{
  font-family: Arial, sans-serif
  }
  
.company-logo{
    // background-color: rgb(28, 28, 173);
    padding: 30px 10px;
    border-radius: 6px;
}

/* Main Container */
.voucher-wrapper {
  // max-width: 900px;
  width: 100%;
  height:auto;
  margin: 0 auto;
  background: #fff;
  padding: 25px;

  color: #000;
  // border: 1px solid #dcdcdc;
  box-sizing: border-box;
}

/* Header */
.voucher-header {
  border: 1px solid #bfbfbf;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.company-logo img {
  width: 120px;
  max-width: 100%;
}

.company-info p {
  margin: 3px 0;
  font-size: 14px;
}

/* Title */
.voucher-title {
  margin-top: 25px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
}

.voucher-subtitle {
  text-align: center;
  font-size: 13px;
  margin-bottom: 25px;
}

/* Section */
.section {
  margin-top: 25px;
  border: 1px solid #ccc;
}

.section-heading {
  background: #f2f2f2;
  padding: 10px 12px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

/* Content */
.hotel-info,
.customer-requests,
.reminder-section {
  padding: 12px 15px;
}

/* Order grid */
.order-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  padding: 12px 15px;
}

.order-grid div {
  flex: 1;
  min-width: 180px;
}

.order-grid .label {
  font-size: 12px;
  color: #555;
}

.order-grid .value {
  font-size: 14px;
  font-weight: bold;
}

/* Table */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-table th,
.order-table td {
  border: 1px solid #d1d1d1;
  padding: 8px 10px;
  text-align: left;
  font-size: 14px;
}

.order-table th {
  background: #f5f5f5;
}

/* Table responsive */
.order-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.order-table {
  min-width: 600px;
}

/* Reminder list */
.reminder-section ol {
  padding-left: 18px;
}

.reminder-section li {
  margin-bottom: 6px;
  font-size: 14px;
}

/* -------- RESPONSIVE BREAKPOINTS -------- */

/* Tablets */
@media (max-width: 768px) {
  .voucher-wrapper {
    padding: 15px;
  }

  .voucher-header {
    flex-direction: column;
    text-align: center;
  }

  .voucher-title {
    font-size: 20px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .voucher-wrapper {
    padding: 12px;
  }

  .voucher-title {
    font-size: 18px;
  }

  .company-info p,
  .hotel-info p,
  .customer-requests p,
  .reminder-section li {
    font-size: 13px;
  }

  .order-grid div {
    min-width: 100%;
  }

  .order-table th,
  .order-table td {
    font-size: 12px;
    padding: 6px;
  }
}

  </style>
</head>
<body>
<div class="voucher-wrapper">

  <div class="voucher-header">
    <div class="company-logo">
      <img src=${company.logo} width="120" height="40" />
    </div>
    <div class="company-info">
      <p><strong>Company Name:</strong> ${company.name}</p>
      <p><strong>Tel:</strong> ${company.phone}</p>
      <p><strong>Email:</strong> ${company.email}</p>
      <p><strong>Addr:</strong> ${company.address}</p>
    </div>
  </div>

  <h2 class="voucher-title">HOTEL VOUCHER</h2>
  <p class="voucher-subtitle">PLEASE PRESENT THIS VOUCHER UPON ARRIVAL.</p>

  <div class="section">
    <div class="section-heading">Hotel Information</div>
    <div class="hotel-info">
      <p class="hotel-name"><strong>${hotel.name}</strong></p>
      <p><strong>Tel.</strong> ${hotel.phone}</p>
      <p><strong>Ads.</strong> ${hotel.address}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-heading">Order Information</div>

    <div class="order-grid">
      <div>
        <p class="label">Reference Number</p>
        <p class="value">${booking.reference}</p>
      </div>
      <div>
        <p class="label">Arrival Date</p>
        <p class="value">${booking.arrival}</p>
      </div>
      <div>
        <p class="label">Departure Date</p>
        <p class="value">${booking.departure}</p>
      </div>
    </div>

    <div class="order-table-wrapper">
    <table class="order-table">
      <thead>
        <tr>
          <th>Unit</th>
          <th>Room Type / Bed Type</th>
          <th>Guests</th>
          <th>Number</th>
          <th>Meal Type</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows
          .map(
            (row, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${row.roomType}<br>${row.bedType}</td>
            <td>${row.guestName}</td>
            <td>${row.number}</td>
            <td>${row.mealType}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    </div>

    <div class="customer-requests">
      <p><strong>* Customer Requests</strong></p>
      ${customer.requests.map((r) => `<p>${r}</p>`).join("")}
      <p class="note">The remarks for the establishment are for reference only. We cannot guarantee them.</p>
    </div>
  </div>

  <div class="section reminder-section">
    <p class="reminder-title"><strong>Reminder:</strong></p>
    <ol>
      ${reminders.map((r) => `<li>${r}</li>`).join("")}
    </ol>
  </div>
</div>
</body>
</html>
`;

    // -------------------------------
    // Launch Browser (ENV AWARE)
    // -------------------------------
    const browser = await playwrightChromium.launch(
      isVercel
        ? {
            args: lambdaChromium.args,
            executablePath: await lambdaChromium.executablePath(),
            headless: lambdaChromium.headless,
          }
        : {
            headless: true, // Local Playwright browser
          }
    );

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return NextResponse.json({
  success: true,
  html,
  pdf: Buffer.from(pdfBuffer).toString("base64"),
});
  } catch (err) {
    console.error("VOUCHER ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate voucher" },
      { status: 500 }
    );
  }
}
