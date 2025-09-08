"use client";
import React, { useState } from "react";
import "../styling/tabs.css"; // import CSS file

export default function HotelTabs({ description, facility }) {
  const [activeTab, setActiveTab] = useState("facilities");

  return (
    <div className="tabs-container">
      {/* Tabs Header */}
      <div className="tabs-header">
        {["Facilities", "Description", "Reviews"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${
              activeTab.toLowerCase() === tab.toLowerCase() ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "facilities" && (
          <div>
            <h2 className="tab-title">Facilities</h2>
           <div className="facilities-list">
  {Array.isArray(facility) && facility.length > 0 ? (
    facility.map((item, i) => (
      <div key={i} className="facility-item">
        <span className="icon">i</span>
        {item}
      </div>
    ))
  ) : (
    <p>No facilities listed</p>
  )}
</div>

          </div>
        )}

        {activeTab === "description" && (
          <div>
            <h2 className="tab-title">Description</h2>
            <p className="tab-text">{description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="tab-title">Reviews</h2>
            <p className="tab-text">
              ⭐⭐⭐⭐ 4.5/5 – Guests loved the cleanliness, location, and
              friendly staff.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
