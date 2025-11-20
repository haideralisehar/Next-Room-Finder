"use client"
import React from "react";
import "./voucher.css";
import Image from "next/image";


const Voucher = () => {
  return (
    <div className="voucher-wrapper">
      {/* Header */}
      <div className="voucher-header">
        <div className="company-logo">
          <img
            src="https://cityin.net/uploads/travel-images/settings-files/0487a1c52501fbaa20b0907990e2f3c1.png"
            alt="Company Logo"
          />
        </div>

        <div className="company-info">
          <p><strong>Company Name:</strong> City in Booking</p>
          <p><strong>Tel:</strong> +973 77918877</p>
          <p><strong>Email:</strong> support@cityin.net</p>
          <p><strong>Addr:</strong> 0428 Seef district, Bahrain</p>
        </div>
      </div>

      <h2 className="voucher-title">HOTEL VOUCHER</h2>
      <p className="voucher-subtitle">PLEASE PRESENT THIS VOUCHER UPON ARRIVAL.</p>

      {/* Hotel Information */}
      <div className="section">
        <div className="section-heading">Hotel Information</div>
        <div className="hotel-info">
          <p className="hotel-name"><strong>Zedwell Piccadilly Circus</strong></p>
          <p><strong>Tel.</strong> 44-20 7096 5414</p>
          <p><strong>Ads.</strong> Great Windmill Street, London (and vicinity), Great Britain</p>
        </div>
      </div>

      {/* Order Information */}
      <div className="section">
        <div className="section-heading">Order Information</div>

        <div className="order-grid">
          <div>
            <p className="label">Reference Number</p>
            <p className="value">15262220160</p>
          </div>

          <div>
            <p className="label">Arrival Date</p>
            <p className="value">November 3, 2025</p>
          </div>

          <div>
            <p className="label">Departure Date</p>
            <p className="value">November 6, 2025</p>
          </div>
        </div>

        <div className="order-table-wrapper">
  <table className="order-table">

          <thead>
            <tr>
              <th>Unit</th>
              <th>Room Type / Bed Type</th>
              <th>Guests (First Name / Last Name)</th>
              <th>Number</th>
              <th>Meal Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Cocoon 2<br />1 Double Bed</td>
              <td>JALAL / SALEH (Adult)</td>
              <td>1 adult(s)</td>
              <td>Room Only</td>
            </tr>
          </tbody>
          </table>
</div>


        <div className="customer-requests">
          <p><strong>* Customer Requests</strong></p>
          <p>Other Requests</p>
          <p>Double Bed</p>
          <p className="note">
            The remarks for the establishment are for reference only. We cannot guarantee them.
          </p>
        </div>
      </div>

      {/* Reminder Section */}
      <div className="section reminder-section">
        <p className="reminder-title"><strong>Reminder:</strong></p>

        <ol>
          <li>Upon your arrival please provide valid government-issued ID to the hotel front desk to locate the accurate booking.</li>
          <li>Please tell front desk agent your preferred bed type if your booking comes with more than one (e.g. Double or Twin).</li>
          <li>All special requests are not guaranteed. Please confirm with front desk upon arrival.</li>
          <li>Check-in time starts at 15:00. Check-out ends at 10:00. Late arrivals must contact the hotel in advance.</li>
          <li>Some hotels charge extra breakfast fee for children even if breakfast is included in the room.</li>
          <li>Regular tax and fees are included unless stated otherwise. Additional charges (city tax, tourism fee, SST, etc.) may apply.</li>
          <li>Front desk will verify guests at check-in. The card used for booking must be presented by the cardholder.</li>
        </ol>
      </div>
      <button className="voucher-prnt" onClick={() => window.print()}>Print / Save as PDF</button>
    </div>
  );
};

export default Voucher;
