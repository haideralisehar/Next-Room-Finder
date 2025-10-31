"use client"
import React from 'react'
import Lottie from "lottie-react";
import notfound from "../lotti-img/notfound.json";
export default function NotFound() {
  return (
    <div>
      <div
  style={{
    display: "flex",
    justifyContent: "center",   // horizontal center
    alignItems: "center",       // vertical center
    height: "100vh",            // full screen height
    width: "100vw",             // full screen width
  }}
>
  <Lottie
    style={{ width: "100%", height: "70%" }}
    animationData={notfound}
  />
</div>


      
    </div>
  )
}
