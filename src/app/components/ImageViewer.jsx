import React, { useState, useRef } from "react";
import "../styling/ImageViewer.css";
import { FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus, FaExpand, FaCompress } from "react-icons/fa";

const ImageViewer = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageRef = useRef(null);

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setZoom(1); // reset zoom
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
    setZoom(1);
  };

  const zoomIn = () => setZoom((prev) => prev + 0.2);
  const zoomOut = () => setZoom((prev) => (prev > 0.4 ? prev - 0.2 : prev));

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (imageRef.current.requestFullscreen) {
        imageRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="viewer-container">
      <div className="main-image-section" ref={imageRef}>
        <img
          src={images[currentIndex]}
          alt="Main"
          style={{ transform: `scale(${zoom})` }}
          className="main-image"
        />
        <div className="controls">
          <button onClick={prevImage}><FaArrowLeft /></button>
          <button onClick={nextImage}><FaArrowRight /></button>
          <button onClick={zoomOut}><FaSearchMinus /></button>
          <button onClick={zoomIn}><FaSearchPlus /></button>
          
          <button onClick={toggleFullScreen}>
            {isFullScreen ? "Exit ⛶" : "Full ⛶"}
          </button>
        </div>
      </div>

      <div className="thumbnail-section">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${
              index === currentIndex ? "active-thumb" : ""
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
