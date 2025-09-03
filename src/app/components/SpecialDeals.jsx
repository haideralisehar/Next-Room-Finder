import React from "react";
import "../styling/SpecialDeals.css";

const SpecialDeals = () => {
  return (
    <div className="special-deals">
      {/* Parent div (heading) */}
      <p className="deals-heading">Special deals for you</p>

      {/* Child div (deal card) */}
      <div className="deal-card">
        <img
          src="https://cityin.net/uploads/travel-images/settings-files/afa21d355a621591cc4da501bb113a9f.webp" 
          alt="Cosy Retreat"
          className="deal-image"
        />
        <div className="deal-overlay">
          <h3>Unwind at a cosy retreat abroad</h3>
          <p>Avail our deals & save on your stay</p>
          <button className="deal-btn">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default SpecialDeals;
