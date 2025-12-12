"use client"
import React from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import SpecialDeals from "./components/SpecialDeals";
import Destinations from "./components/Destinations";
import Footer from "./components/Footer";
import Cookies from "js-cookie";
import Testimonials from "../app/gallery/page"
import AbtSection from "../app/abt/page"
import StepsSection from "../app/components/StepsSection"
import Voucher from "./print/Voucher/DownloadBtn"

function page() {
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");


  return (
    <>
      <Header />
      {/* <button onClick={()=>{window.location.reload()}}>
            Refresh Page
        </button> */}
      <Banner />
      {!token && !userId ? (
        <>
        <AbtSection/>
        <Testimonials/>
        <SpecialDeals />
      <Destinations />
        </>
      ):(
     <>
     <AbtSection/>
     <Testimonials/>
      <StepsSection/>

{/* <Voucher/> */}
      
      </>
      )
      }
      
      <Footer />
    </>
  );
}

export default page;








{/* <div className="hotel-card" key={hotel.id}>

     
      <div className="hotel-image-wrapper">
        <img
          src={hotel.images[0].url || hotel.images[3].url}
          alt={hotel.name}
          className="hotel-image"
        />
      </div>

      
      <div className="hotel-details">
        <h2 className="hotel-title">{hotel.name}</h2>

        
        <StarRating rating={hotel.starRating || 0} />

        
        <p className="hotel-location">
          {hotel.location.address}
        </p>

        
        {hotel.priceInfo ? (
          <div className="hotel-price-box">
            <p className="hotel-price-title">Price Details</p>
            <p className="hotel-price-value">
              From {hotel.priceInfo.Currency}{" "}
              <strong>
            {hotel?.priceInfo?.LowestPrice?.Value
              ? hotel.priceInfo.LowestPrice.Value
              : "N/A"}
          </strong>
            </p>
          </div>
        ) : (
          <p className="hotel-no-price">No price available</p>
        )}

        <button className="hotel-btn">View Hotel</button>
      </div>
    </div> */}