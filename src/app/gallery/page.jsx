"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./gallery.css";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      image: "/album/im1.jpg",
      stars: 5,
      text: "Finding the right hotel used to take hours, but this platform made everything effortless.",
      name: "Emily Carter",
      role: "Home Buyer",
      avatar: "/album/u1.jpg",
    },
    {
      id: 2,
      image: "/images/t2.jpg",
      stars: 5,
      text: "This website changed the way I book hotels. The photos are genuine, the descriptions are clear.",
      name: "James Nolan",
      role: "Property Seller",
      avatar: "/album/u2.jpg",
    },
    {
      id: 3,
      image: "/images/t3.jpg",
      stars: 4,
      text: "A truly exceptional platform for travelers. From filters to reviews, everything is designed to give you confidence before you book.",
      name: "Laura Smith",
      role: "Landlord",
      avatar: "/album/u3.jpg",
    },
  ];

  // Track screen width to avoid "window is not defined"
  const [screenWidth, setScreenWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    updateWidth(); // initial width
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const [index, setIndex] = useState(0);

  const next = () => {
    if (screenWidth <= 768) {
      if (index < testimonials.length - 1) setIndex(index + 1);
    } else {
      if (index < testimonials.length - 2) setIndex(index + 1);
    }
  };

  const prev = () => index > 0 && setIndex(index - 1);

  return (
    <div className="testimonials-section">
      <div className="text-center">
        <p className="testimonials-subtitle">Testimonial's</p>
        <h1 className="testimonials-title">What Our Customers Say</h1>
      </div>

      <div className="slider-wrapper">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${
              screenWidth <= 768 ? index * 100 : index * 50
            }%)`,
          }}
        >
          {testimonials.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <div className="testimonial-content">
                <div className="stars">{"★".repeat(item.stars)}</div>
                <p className="testimonial-text">{item.text}</p>

                <div className="testimonial-profile">
                  <Image
                    src={item.avatar}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="avatar"
                  />
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {item.name}
                    </h5>
                    <p style={{fontSize:"11px", color:"#969696ff"}}>{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonial-buttons">
        <button onClick={prev} className="arrow-btn">&#8592;</button>
        <button onClick={next} className="arrow-btn active">&#8594;</button>
      </div>
    </div>
  );
}
