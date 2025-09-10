
import React, { useState } from "react";


import RoomCard from ".//RoomCard"

export default function Rooms() {
    

   
    

  return (
    <>
    <div style={{marginTop:"20px"}}>
        <h2 style={{fontWeight:"bold", fontSize:"20px", paddingBottom:"10px"}}>Choose Room</h2>
        <HotelSearchBar showDestination={false} initialDestination="Islamabad" />

       <RoomCard images={images}/>       
    </div>
    </>
  )
}
