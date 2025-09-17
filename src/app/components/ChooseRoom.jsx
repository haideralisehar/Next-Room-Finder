import React, { useState } from "react";
import { FaPerson } from "react-icons/fa6";
import { FaChild } from "react-icons/fa";

export default function RoomSelection({ rooms, currentRoomIndex, onRoomClick  }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleSelect = (index) => {
    setSelectedRoom(index);
  };

  return (
    <div
      style={{
        padding: "10px 10px",
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        flexWrap: "wrap", // ✅ so cards go to next line if screen is small
      }}
    >
      {rooms && rooms.length > 0 ? (
        rooms.map((r, i) => (
          <div
            key={i}
            onClick={() => onRoomClick(i)}
            style={{
              padding: "15px 15px 10px 15px",
              borderRadius: "10px",
              cursor: "pointer",
              border:
                currentRoomIndex === i ? "2px solid #007bff" : "1px solid #ccc",
              backgroundColor: selectedRoom === i ? "#e6f2ff" : "#f9f9f9",
              minWidth: "200px", // ✅ each card width
              flex: "1 1 auto", // ✅ responsive flex sizing
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "3px",
                //  border: currentRoomIndex === i ? "2px solid #007bff" : "1px solid #ccc",
                // backgroundColor: currentRoomIndex === i ? "#e6f2ff" : "#f9f9f9",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                }}
              >
                <p
                  style={{
                    color: "black",
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Room {i + 1}:
                </p>
              </div>

              <p
                style={{
                  color: "black",
                  margin: 0,
                  display: "flex",
                  fontSize: "14px",
                }}
              >
                {
                  <>
                    <FaPerson fontSize={"20px"} /> {r.adults}
                  </>
                }
              </p>

              {r.children > 0 && (
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    flexWrap: "wrap",
                  }}
                >
                  {r.childrenAges?.map((age, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: "black",
                        display: "flex",
                        fontSize: "14px",
                      }}
                    >
                      <>
                        <div
                          className="linee"
                          style={{
                            width: "1px",
                            height: "20px",
                            backgroundColor: "black",
                            margin: "0px 5px",
                          }}
                        ></div>
                        <FaChild fontSize={"20px"} /> {idx + 1}
                      </>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No rooms selected</p>
      )}
    </div>
  );
}
