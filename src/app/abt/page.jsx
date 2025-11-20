import Image from "next/image";
import "./abt.css";

export default function AbtSection() {
  return (
    <div className="about-section">
      <div className="about-container">

        {/* Left Image */}
        <div className="about-image">
          <Image
            src="/album/Got.jpg"  // replace with your own image path
            width={600}
            height={400}
            alt="Team"
          />
        </div>

        {/* Right Content */}
        <div className="about-content">
          <h3 className="about-subtitle">About Us</h3>

          <h1 className="about-title">
            Delivering Exceptional<br />Hotels With Unmatched<br />Quality
          </h1>

          <p className="about-text">
            We are committed to helping you find the perfect property. 
            With years of experience and a deep understanding of the market, 
            our expert team is here to guide you through every step of the buying process.
          </p>

          <button className="about-btn">Learn More</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-wrapper">
        <div className="stat-box">
          <h2>1,500</h2>
          <p>Total Hotel, Helping Families Find Their Dream Hotel.</p>
        </div>

        <div className="stat-box">
          <h2>30+</h2>
          <p>Strong Partnerships With Local Businesses To Enhance Our Services.</p>
        </div>

        <div className="stat-box">
          <h2>98%</h2>
          <p>Client Satisfaction Rate, Reflecting Our Commitment To Exceptional Service.</p>
        </div>
      </div>
    </div>
  );
}
