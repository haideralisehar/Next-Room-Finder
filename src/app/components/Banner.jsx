"use client";
import React, { useState } from "react";
import "../styling/Banner.css";
import HotelSearchBar from "../components/RoomSearch"



const Banner = () => {

  return (
    <section className="banner">
      <div className="banner-overlay">
        <div className="banner-content">
          <div className="web-set">
          <h1>Let’s book your trips!</h1>
          <p>Choose from over 2+ million hotels worldwide!</p>
          </div>
        </div>

       

         <HotelSearchBar/>
          </div>
        
      
    </section>
  );
};

export default Banner;
