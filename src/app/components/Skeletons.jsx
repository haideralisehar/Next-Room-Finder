import React from "react";
import "../styling/skeleton.css"
export const Skeletons = ({
  width = "100%",
  height = "0.5rem",
  circle = false,
  className = "",
}) => {
  return (
    <div
      className={`skeleton-box ${circle ? "rounded-full" : "rounded-md"} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
};
