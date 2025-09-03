import React from 'react'
import Header from "./components/Header"
import Banner from "./components/Banner"
import SpecialDeals from "./components/SpecialDeals"
import Destinations from "./components/Destinations"
import Footer from "./components/Footer"

function page() {
  return (
    <>
    <Header/>
      <Banner/>
      <SpecialDeals/>
      <Destinations/>
      <Footer/>
    
    </>
  )
}

export default page
