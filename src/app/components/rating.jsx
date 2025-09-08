"use client";
import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating, totalStars = 5 }) {
  return (
    
             <div style={{ display: "flex", gap: "4px" }}>
          {[...Array(totalStars)].map((_, index) => {
            const starNumber = index + 1;
            return starNumber <= rating ? (
              <FaStar key={index} color="#ffb005ff" size={15} />
            ) : (
              <FaRegStar key={index} color="#ccc" size={15} />
            );
          })}
        
        </div>
  );
}
