"use client"
import React from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import SpecialDeals from "./components/SpecialDeals";
import Destinations from "./components/Destinations";
import Footer from "./components/Footer";
import Cookies from "js-cookie";
import StepsSection from "../app/components/StepsSection"

function page() {
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");


  return (
    <>
      <Header />
      <Banner />
      {!token && !userId ? (
        <>
        <SpecialDeals />
      <Destinations />
        </>
      ):(
     
      <StepsSection/>
      )
      }
      
      <Footer />
    </>
  );
}

export default page;
