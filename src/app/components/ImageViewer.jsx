"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "../styling/ImageViewer.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearchPlus,
  FaSearchMinus,
  FaTimes,
} from "react-icons/fa";

// Dynamic imports for leaflet (SSR disabled)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const ImageViewer = ({ images, location }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [L, setL] = useState(null);
  const imageRef = useRef(null);

  const imagess = ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDw8NDQ8NDQ0NDQ0NDQ0NDw8NDQ0NFREWFhURFRUYHSggGBomGxUVITEhJSkrLjAuFx8zODMsNyotLisBCgoKDg0OFQ8QFSseFR8tLS0rKysrLSstLSsrLSsrKysrLS0tLS0tLSsrLSstKy0rKy0tLS0rKy0rLS0rLS0rK//AABEIALcBEwMBEQACEQEDEQH/xAAcAAADAQADAQEAAAAAAAAAAAAAAQIDBAUGBwj/xAA+EAACAQMBBgMEBAwHAAAAAAAAAQIDBBESBQYhMUFRE2FxFCKBkQdCUqEjMjNUYnKSsbLB0eEWJDRzgqLC/8QAGgEBAQEBAQEBAAAAAAAAAAAAAAECAwQFBv/EACsRAQEAAgEDAwMDBQEBAAAAAAABAhEDEiExBBNBBTJRFCJhI0JScbGRFf/aAAwDAQACEQMRAD8A9Yj8u/RqRFUiKaIsURTQQ0QUgyaIKIh4CGENBDwA8AGADACwAmgE0FIKQUmFSyhBSKqQoZRDKJZYiWVlLKJKlSyoRUbow2aJVWiKpGVMBkDQRSIypESqQQwikghhDwA8BBgGxgGywAsBSaCpYUmFSw0lgJlVLCkyqRVSylSyohlRLZWUtlRLZpE5A5CMNKRK0pEVaMqaAZEURk0RFoIpBk0glUEUkENIIeAh4AMALAUmgqWF2lhUsKlhpDCpZWoQCKpFaSwiGaRDZUSzSIbKiWVCyVHIRzbWiKpGWlIgoBoiGiIpMjKkEq0GVRCLQRSDJpBFJBNngGywDZNA2WAqGg0lhpDCpYaiGGksqkwqWVUsqpyUS2VEM0iGVlLKlSyokqOUjm2pMy0tEVSIGgGRFEQ0RFoM1SDNWiItBmrSDNUkE2tIM7PSE2NINpaC7S0GtoYajNhqIYaSw1EMrSGFhMqpyVpLZVQ2US2aSobKyhs0yhsqJcionJdI5aOTotMiqTM1pSZBQRSZENMiKREVFhFojNWgyuIZrSIYrSKDNaRQYtWoFZ2HAHUzlEjcrOSDUZyDcZSDcQw1GcmGohsrSWytSIbK1pOSqlsqobNIiTKyls1EQ2VlLZUQ2VCyVHKTOTotMirTMtKTCqTIKTIhpmWVJkRSYRomRlaIzWkQxWkSsVtAjFcmlTyaxm+0ccstOfSs+/A+pxfTsspvK6eXLm/B1LPsa5fptk3jdmPM6+vSwfKzxuN1Xqwy24s0YdoxkHSMZB0jNlaiJBuIZWohlWJZWksqpZVZs1GUM0lTI0yzZWUsqJZUTkqOUmcnRaZFWmRpaZmtRSZA0yIpMiKTIikyM6aRZGatMjLSLDFaxIxW9MOWTtdnwTeex9P6bxzLk3fh4ueuwPvvK6Hbt3KF7sqjCVVOtc3bqQhLTTnQhZ1W9a+slN0seYHY7QgsZPi/VOOSzOfL0cGXfTp6h8d78WEw6xjIrpGbDUZyK3EMrSGytJZppLZVTJlGbZqMs5MsSobNMpbLGUNmkS2VE5COUjm6KTIq0zLS0yNRaMqpBDREUmZRSZGVpkSxpFkYq4sjNbRYc7G8JBzyjtNnVUnh9T3/AE7mnHyavivFz4Xy5t5c0qFOdWtUhRpU4uVSrOShCEftNvgj9G8b4L9B1WE9vXuLirdxja3bt7ispa60fHorxXqeYycUufHHbAH3HaNVfi9j4X1PnmWUwnw9PBh8unqSPkvfjGE5FdpGMmG5GcmVuRm2aajSNs2s5w+kepNsXlkunGlw5mo7zuJU5LoXcJlL8smzUbZykakRDZplnKRplLZYlEIauv8AUW6JjsnFYeOL8+Y3dmuzCWUdI5VPEpquSpHPTa1IzppSmTTS1IzpWikTTUUmZVSZE0rJGVpmWapMJVKRGa0UjLNjSMgzY1hIjnY19onocqWmctDdPVLEJPHDMlnh5mpNZfu7OOWO52ec3juoW1tPaW2nRvJ28M2tgsqwjcPhHEJPNWpl/jy5JPEY8c/X9N6vPLPHi45vH83y8PJw9M6q+RfRTt+labYVzcVadvCtC4hOcvdpqVTil+itSXF8EfR9X7ntX2/uceOS5Tfh+hKtfVxznJ+Vu99/L6mGGnGnMO0jKUiukjKTLG4zbK1E6scewXW43uqnKS5NcuXESOXHj5jLxE8uWn5LJdOnT8RhO4Wps3MG+jU0407mPHhw+/J0mFN6ZO5hFLHvZfHK4pG5halyiKl3FYUW3jPF8mWcdvlLySeGXt3lF/DBv2mfdZyvm+eGuzNTiZ91PtuHmKwuHqy+1+U97V7M6l4285LONjLl7sncm+hnrHthPbPccxVkcul23DVdE6V6opXCJcFmcX7THt95Oite5FK78kT2z3FRvPJEvGvuLV4zPtr1Rorp9zNwXs0jcvu/mZuC6x/DRXD7melPbjSFw/J+pm4s3jjWFz5L5E0xeJoq0X0+RNM9GUZX6nUpVIUJxpVZwcYVJpzjTb4OeOrSy0urSNcdxxzlym5HLPDO42Ty81Q+j60o04wtLvaVpUjGKdShdSiqkkuMpQ5cc5wsHsv1DPK/uwln8x5f0uvFscWf0cq5rKttS/u9oqnwpU5YoxjHs8N8+unTyNf/AEejHXFhMU/Sbu88tvQbW3Xsbizdl7PRhCNKULdqCToTw9Moy5p5eX345zk83F6rkx5Ou5X+XXLgxuPTI4v0c3Tq7Mo05vTXs3Oyr0vrU6lKWnS/PTpN+vw1zWzxl3jPp8v2Sa8dnoW19Z/BczxvV3+EqpDi+q5RfFM1penLwyncPjnDz0fIsjpOKIlc5SUknjk1wL0rOLV3Kz8aPPkXprdwrOVTPN5NSNzGRlOoakVhOZ0kYtcapI6yOVrjTkdJHOsZSNyOdrOUjWmds3MrO0uZdJtDqF0m0OoXSbTrLpNuw1nHTvtakTTSkzNixRGtKUWRdLUWTa6PI0q4zM2LtpGZixqVrGZmxuVrGoYsalaxmZsVamZ0mlqoZ0zcVxqE0zcGirPuTTPtxXtD/t0Gmfbefhu1aRu6t8/FlVq1I1fD8SUaEKigouShHCk3jPvZPVfVcntzj+J/65Y+kwmdzdy6p5tPVMWdSqknJtJJNtt4SS5ts1Md9oupO9eduN+Nk03pleUm849yNSpH5xi0evH0XNZvpee+s4J26nNstuWdzwt7ijWljOmE4ueP1eZnL0/Jh92Lthz8ef25SuROqZkbuTKVY3MWOplUuElltJLm28JG5hti56dJe73bOovTO5pt5aapqVXD83BM74+l5L/a8+Xq+Kf3HbbxWVdZp3NF+UpqnL9mWGW8GePnFJ6jjy8ZORC6p1Pyc4T/AFJRl+4dFnmL1y+KUpFkZ2zky6Z2zbLpnaGzWk241zeUqazUqU4L9OcY/vNzG3xGbnJ5rrbjeSxp868ZP9BSqfekbnFnfhyvNhPl1899LRNpQryXdRgk/nI6exkx+ox/D12s8ens2tVHyJpeo1MaNtI1X3JY1Mmirsz0xvrpqo+5NHVVqZNNbXGZnTUrWMjNjUrSMzNjUrWMzFjcrWMzNjUrSMzGmtrUiaVakZ0mj1DSaGoaNE5DS6RUqxinKTUYxTlKTeFGK4tt9jUxtuoXUm6+Qb979O9UrS0UoW2r8JUfCVxh8ML6sOvd8OXI+56T0c4v35fd/wAfC9X628n7MPt/68Ke98802uK4NcmugHa2+8u0aUdMLu4UVyTqOSXpnkcrw8d73GOs5+SdplWn+K9p/ndb5r+g9jj/AMYv6jl/yrr77aNxcPNetVqvp4k3JL0XJG8cMcfE055Z5ZebtxTTIAcZNcU2n3XBgX40/tS/aZNRd0eNP7Uv2mNQ3S8af2pfNjRuk6knzbfq2XRupCAAA+yKR83T6m1KZNLtSmTS7UpE01tamRdrjMml20jMzY1tpGZnTUrSMyWNytYzM6a24tzt2zoPTVuaEJYzpdSOrHoWcGeXeYsXn48fOUc60u6daCqUpwqU5cpwkpRffijlnhcbqzu7YZzKbxu45EZmNN7WpmdNbWqhNLs1UJ0mz1jpXYdQaNun3sqf5C8x+aV/4Gej00/q4f7ef1V/o5/6fAj9C/NAAAAAAAAAAAAAAAAAAAAPrykfP0+ltSkNLtSkZ0u2kCVqKyRVJmaq4sjQr3VOjHXWnCnBfWnJRWfiJjcu0hcpj3t087tTfy1pe7bRlcT+0806S+LWX8vid8PS5X7uzhn6zGfb3rxO2N4bu8b8Wo1DpRp5hSS9OvxyezDiww8R4eTmzz811R0cne7p7drWVeGhylRqTjGrRz7s0+GpLpJd/I48/FjyY3fl34ObLjymvD7Oqh8W4vuyrVQz0tTJbqGelrqHiF6TqHiE0dROZdJ1M6umcXGSUoyTjKL4qUWsNM1O13Eveavh8d3y3cez6qdPVK2q5dKT4uEutNvv27r0Z9n0/N7mPfzHwvU8HtZdvtrzh6HmAAAAAAAAAAAAAAAAAAB9bTPA+gaYU0wqlIml2pSM6XbhbT21b2q/Cz97pTh71R/Dp6s3jxZZeGcuXHHzXmNob71pZjbQVFfblidTHkuS+874+nxnnu8+Xqsv7ezzN3d1a8tdac6ku823hdl2R3kk7R5rlcru1gVAAAcnZskq9Fvkq1Jv01Izl4rWP3R9vVQ+Np92ZKVUnSvUrxidK9RqqTpXqPxR0nUTqjpOonVLpOpw9q2lK6oVKFVZVSOE+sJdJLzTOnHlcMplHPlxmeNxr4lWpSpylCSxKEpQku0k8M+zLvu+HZq6QEAAAAAAAAAAAAAAAAAH1lHgfQUmlxbSXVvgkGo6263gsqT0utGTXSmpVPvSwbnHlfhzy5cJ8urut8qUcqjSnN9HNqEflxZ0nBfmud9RPiOgv94buvwdTw4P6lL3F8XzfzOuPHjPhxy5csvl1TZtzIAAAAAAuim5RS4tyikvPIqx9r1nyNPsympk0u1KZNLtSmNLsaxo2WsaNk5jSbS5l0m3yvfG18K9rYWI1Gq0fPUsv/tqPp8OW8I+Vz465K6Q6uIAAAAAAAAAAAAAAAAA9Pdb41ZfkqUIec5Oo/5HGcM+a75c9viOivNoV6/5WpOfk3iK/wCK4HWYyeI5XK3zXFKyAAAAAAAAAADut1dmSubiEsfgqMo1KkunB5UfVtfLJy5c+nH+XXhw6sp+H03UfO0+ns9Q0pqQD1EXZ6gByAlyKhOQHjfpCtMxo3C6N0Z+j96P/r5nr9Nl5xeL1WPjJ4k9bxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaWQPp+71l7NbU6bWJta6nLOuXFp+nBfA8HLl1ZbfS4senGR2Wo5adD1DS7PUNGxqGjZ6iaNjUXRtOoaNjWNG3HvbeFenKlUWYTWH3XZrzTNY243cYykymq+X7UsJ2tWVGfNcYyXKcXykj6GOUym4+bljcbquIaZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHb7rWyq3VNNZjDNVr9Xl9+Dny3WNdOHHecfRsnifR2eSAyA8gGoaBqGgnIaNjI0bLUVCbGh1O8ezI3NGXJVacZSpy68OLj6M68efTf4cuXCZT+Xzk9jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0O5H+pl/sT/iicub7Xf0/3vc5PI9hphYeSKMhAmAZCkEGSgyAshE5KPll3DTUqRXBRqTil2w2e6eHzb5ZFQAAAAAAAAAAAAAAAAAAAAAAAAAAAB6DcpP2mT6KhL+KJy5vtduD7nt8nlew0yKNQBqBsagbGoGw5A2NQCbKFkIMgeG3tsPCreKl7lb3uHSovxl/P4s9XFluaeLmx1lv8uiOrkAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZuPSaVap0bhBd8rLf70cOe+I9HBPNeoyed6TyAZClkIMgPIUZAMgACyAZCOs3htPHt5x+tBeJD1j/AGyjpx3WTny47xfPj1vEAAAAAAAAAAAAAAD/2Q=="]

  // Load Leaflet client-side only
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      leaflet.Marker.prototype.options.icon = DefaultIcon;
      setL(leaflet);
    })();
  }, []);

  // Handlers
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setZoom(1);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  };

  const zoomIn = () => setZoom((prev) => prev + 0.2);
  const zoomOut = () => setZoom((prev) => (prev > 0.4 ? prev - 0.2 : prev));

  const toggleFullScreen = () => {
    if (!isFullScreen && imageRef.current?.requestFullscreen) {
      imageRef.current.requestFullscreen();
    } else if (isFullScreen && document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  // Location fallback
  const position = Array.isArray(location)
    ? location
    : [24.7136, 46.6753];

  return (
    <div className="viewer-container">
      {/* MAIN IMAGE */}
      <div className="main-image-section" ref={imageRef}>
        <img
          src={imagess[currentIndex]}
          alt="Main"
          style={{ transform: `scale(${zoom})` }}
          className="main-image"

           onError={(e) => {
                                  e.target.src =
                                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                                }}
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

      {/* THUMBNAILS */}
      <div className="thumbnail-section">
        {imagess.map((img, index) => (
          <React.Fragment key={index}>
            {/* SLOT 2 → Show map button */}
            {index === 1 && (
              <div
                className="empty-thumb"
                style={{
                  backgroundColor: "#fbfbfb",
                  borderRadius: "7px",
                  cursor: "pointer",
                  border: "2px solid #dfdfdf"
                }}
                onClick={() => setShowMap(true)}
              >

                 
                <img
                  style={{  margin:"13px 10px",width: "30px", height: "30px", maxWidth:"100px" }}
                  src="https://cdn-icons-gif.flaticon.com/16496/16496571.gif"
                  alt="Map Icon"
                />
              </div>
            )}




            <img
                              src={img}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${
                index === currentIndex ? "active-thumb" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
                                onError={(e) => {
                                  e.target.src =
                                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                                }}
                              />
{/* 
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className={`thumbnail ${
                index === currentIndex ? "active-thumb" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            /> */}
          </React.Fragment>
        ))}
      </div>

      {/* MAP OVERLAY */}
      {showMap && L && (
        <div className="map-overlay">
          <button className="close-btn" onClick={() => setShowMap(false)}>
            <FaTimes size={20} />
          </button>

          <MapContainer
            center={position}
            zoom={3}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[
                  location[0],
                  location[1],
                ]}>
              <Popup>📍 Hotel Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
