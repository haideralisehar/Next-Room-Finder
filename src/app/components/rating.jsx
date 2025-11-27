"use client";
import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating, totalStars = 5 }) {

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;

        if (starNumber <= Math.floor(rating)) {
          // FULL STAR
          return <FaStar key={index} color="#ffb005ff" size={15} />;
        }

        if (starNumber === Math.floor(rating) + 1 && rating % 1 !== 0) {
          // HALF STAR
          return <FaStarHalfAlt key={index} color="#ffb005ff" size={15} />;
        }

        // EMPTY STAR
        return <FaRegStar key={index} color="#ccc" size={15} />;
      })}
    </div>
  );
}
