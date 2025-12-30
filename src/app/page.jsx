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







