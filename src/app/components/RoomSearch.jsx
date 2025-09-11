"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../styling/HotelSearchBar.css";
import { useRouter } from "next/navigation";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const destinations = ["Bahrain", "Dubai"];

export default function HotelSearchBar({
  initialDestination = "",
  initialCheckIn = null,
  initialCheckOut = null,
  initialRooms = [{ adults: 2, children: 0, childrenAges: [] }],
  showDestination = true,
  onSearch,
  rooms: controlledRooms,          // ✅ allow parent to control rooms
  onRoomsChange,                   // ✅ callback to parent
}) {
  const router = useRouter();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const parseDate = (str) => {
    if (!str) return null;
    const parts = str.split("-");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  };

  const [destination, setDestination] = useState(initialDestination);
  const [checkInDate, setCheckInDate] = useState(
    initialCheckIn ? parseDate(initialCheckIn) : today
  );
  const [checkOutDate, setCheckOutDate] = useState(
    initialCheckOut ? parseDate(initialCheckOut) : tomorrow
  );

  // ✅ Use parent state if provided, otherwise fallback to local
  const [localRooms, setLocalRooms] = useState(initialRooms);
  const rooms = controlledRooms !== undefined ? controlledRooms : localRooms;
  const setRooms = onRoomsChange || setLocalRooms;

  const [showPopup, setShowPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateBoxRef = useRef(null);

  const [dateRange, setDateRange] = useState([
    { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
  ]);

  useEffect(() => {
    setDateRange([
      { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
    ]);
  }, [checkInDate, checkOutDate]);

  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const updateCount = (roomIndex, type, operation) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) => {
        if (i !== roomIndex) return room;
        const updatedRoom = { ...room };
        if (operation === "increment") updatedRoom[type] += 1;
        if (operation === "decrement" && updatedRoom[type] > 0)
          updatedRoom[type] -= 1;

        if (type === "children") {
          if (updatedRoom[type] > updatedRoom.childrenAges.length) {
            updatedRoom.childrenAges = [...updatedRoom.childrenAges, null];
          } else {
            updatedRoom.childrenAges = updatedRoom.childrenAges.slice(
              0,
              updatedRoom[type]
            );
          }
        }
        return updatedRoom;
      })
    );
  };

  const handleChildAgeChange = (roomIndex, childIndex, age) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex].childrenAges[childIndex] = age;
      return updatedRooms;
    });
  };
  const handlePopupToggle = () => setShowPopup(!showPopup);

  const addRoom = () =>
    setRooms([...rooms, { adults: 2, children: 0, childrenAges: [] }]);
  const deleteRoom = (roomIndex) =>
    setRooms(rooms.filter((_, i) => i !== roomIndex));

  const CloseDone = () => setShowPopup(false);

  const getSummary = () => {
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
    const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);
    return `${totalRooms} Room${
      totalRooms > 1 ? "s" : ""
    }, ${totalAdults} Adults${
      totalChildren > 0 ? `, ${totalChildren} Children` : ""
    }`;
  };

  const handleSearch = () => {
    if (showDestination && !destination) {
      alert("Please enter a destination!");
      return;
    }

    const normalizedDest = destination
      ? destination.charAt(0).toUpperCase() +
        destination.slice(1).toLowerCase()
      : "";

    const searchParams = {
      destination: normalizedDest,
      from: formatDate(checkInDate),
      to: formatDate(checkOutDate),
      rooms,
      nights,
    };

    if (onSearch) {
      // 🔹 Parent (like viewcontent) handles filtering
      onSearch(searchParams);
    } else {
      // 🔹 Default behavior → navigate to results page
      const searchUrl = `/results?destination=${normalizedDest}&from=${formatDate(
        checkInDate
      )}&to=${formatDate(checkOutDate)}&rooms=${encodeURIComponent(
        JSON.stringify(rooms)
      )}&nights=${nights}`;

      if (window.location.pathname === "/") {
        router.push(searchUrl);
      } else {
        router.replace(searchUrl);
      }
    }
  };

  const applyDates = () => setShowDatePicker(false);
  const cancelDates = () => {
    setDateRange([
      { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
    ]);
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date || isNaN(date)) return "";
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  return (
    <div>
      {/* 🔹 Search Bar */}
      <div className="search-bar">
        {/* Destination */}
        {showDestination && (
          <div className="search-box">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              placeholder="Enter destination"
              list="destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <datalist id="destinations">
              {destinations.map((place, i) => (
                <option key={i} value={place} />
              ))}
            </datalist>
          </div>
        )}

        {/* Dates */}
        <div
          className="search-box date-box"
          ref={dateBoxRef}
          onClick={() => setShowDatePicker(true)}
        >
          <FaCalendarAlt className="icon" />
          <input
            type="text"
            readOnly
            value={
              checkInDate && checkOutDate
                ? `${formatDate(checkInDate)} -- ${formatDate(checkOutDate)}`
                : "Select dates"
            }
          />
          {showDatePicker && (
            <div
              className="date-picker-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <DateRange
                ranges={dateRange}
                onChange={(ranges) => {
                  const { startDate, endDate } = ranges.selection;
                  setCheckInDate(startDate);
                  setCheckOutDate(endDate < startDate ? startDate : endDate);
                  setDateRange([
                    {
                      startDate,
                      endDate: endDate < startDate ? startDate : endDate,
                      key: "selection",
                    },
                  ]);
                }}
                minDate={today}
                moveRangeOnFirstSelection={false}
                rangeColors={["#0071c2"]}
              />
              <div className="footer-buttons">
                <button className="cancel-btn" onClick={cancelDates}>
                  Cancel
                </button>
                <button className="apply-btn" onClick={applyDates}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="search-box" onClick={handlePopupToggle}>
          <FaUsers className="icon" />
          <input type="text" value={getSummary()} readOnly />
        </div>

        {/* Search Button */}
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch /> Search Hotels
        </button>
      </div>

      {/* 🔹 Multi-room Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="room-section">
                <h3>Room {roomIndex + 1}</h3>
                {roomIndex > 0 && (
                  <button
                    className="delete-room-btn"
                    onClick={() => deleteRoom(roomIndex)}
                  >
                    <FaTrash /> Remove
                  </button>
                )}

                {/* Adults */}
                <div className="counter">
                  <label>Adults</label>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "adults", "decrement")
                    }
                  >
                    <FaMinus />
                  </button>
                  <span>{room.adults}</span>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "adults", "increment")
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Children */}
                <div className="counter">
                  <label>Children</label>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "children", "decrement")
                    }
                  >
                    <FaMinus />
                  </button>
                  <span>{room.children}</span>
                  <button
                    onClick={() =>
                      updateCount(roomIndex, "children", "increment")
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Children Ages */}
                {room.children > 0 && (
                  <div className="children-ages">
                    {room.childrenAges.map((age, childIndex) => (
                      <div key={childIndex} className="child-age">
                        <label>Child {childIndex + 1} Age:</label>
                        <select
                          value={age || ""}
                          onChange={(e) =>
                            handleChildAgeChange(
                              roomIndex,
                              childIndex,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Age</option>
                          {Array.from({ length: 16 }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="add-room-btn" onClick={addRoom}>
              + Add Room
            </button>
            <button className="close-btn" onClick={CloseDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaUsers,
//   FaSearch,
//   FaPlus,
//   FaMinus,
//   FaTrash,
// } from "react-icons/fa";
// import "react-datepicker/dist/react-datepicker.css";
// import "../styling/HotelSearchBar.css";
// import { useRouter } from "next/navigation";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// const destinations = ["Bahrain", "Dubai"];

// export default function HotelSearchBar({
//   initialDestination = "",
//   initialCheckIn = null,
//   initialCheckOut = null,
//   initialRooms = [{ adults: 2, children: 0, childrenAges: [] }],
//   showDestination = true,
//   onSearch,                     // 🔹 callback to parent when search pressed
//   rooms: controlledRooms,       // 🔹 allow parent to control rooms
//   onRoomsChange,                // 🔹 callback to parent for room changes
// }) {
//   const router = useRouter();

//   const today = new Date();
//   const tomorrow = new Date();
//   tomorrow.setDate(today.getDate() + 1);

//   const parseDate = (str) => {
//     if (!str) return null;
//     const parts = str.split("-");
//     if (parts.length !== 3) return null;
//     const [day, month, year] = parts.map(Number);
//     return new Date(year, month - 1, day);
//   };

//   // ✅ Destination
//   const [destination, setDestination] = useState(initialDestination);

//   // ✅ Dates
//   const [checkInDate, setCheckInDate] = useState(
//     initialCheckIn ? parseDate(initialCheckIn) : today
//   );
//   const [checkOutDate, setCheckOutDate] = useState(
//     initialCheckOut ? parseDate(initialCheckOut) : tomorrow
//   );

//   // ✅ Rooms (controlled or local)
//   const [localRooms, setLocalRooms] = useState(initialRooms);
//   const rooms = controlledRooms !== undefined ? controlledRooms : localRooms;
//   const setRooms = onRoomsChange || setLocalRooms;

//   // ✅ UI popups
//   const [showPopup, setShowPopup] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const dateBoxRef = useRef(null);

//   // ✅ Date Range
//   const [dateRange, setDateRange] = useState([
//     { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
//   ]);

//   useEffect(() => {
//     setDateRange([
//       { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
//     ]);
//   }, [checkInDate, checkOutDate]);

//   const nights =
//     checkInDate && checkOutDate
//       ? Math.max(
//           1,
//           Math.ceil(
//             (checkOutDate.getTime() - checkInDate.getTime()) /
//               (1000 * 60 * 60 * 24)
//           )
//         )
//       : 1;

//   // ✅ Update adults/children count
//   const updateCount = (roomIndex, type, operation) => {
//     setRooms((prevRooms) =>
//       prevRooms.map((room, i) => {
//         if (i !== roomIndex) return room;
//         const updatedRoom = { ...room };
//         if (operation === "increment") updatedRoom[type] += 1;
//         if (operation === "decrement" && updatedRoom[type] > 0)
//           updatedRoom[type] -= 1;

//         if (type === "children") {
//           if (updatedRoom[type] > updatedRoom.childrenAges.length) {
//             updatedRoom.childrenAges = [...updatedRoom.childrenAges, null];
//           } else {
//             updatedRoom.childrenAges = updatedRoom.childrenAges.slice(
//               0,
//               updatedRoom[type]
//             );
//           }
//         }
//         return updatedRoom;
//       })
//     );
//   };

//   // ✅ Handle children age input
//   const handleChildAgeChange = (roomIndex, childIndex, age) => {
//     setRooms((prevRooms) => {
//       const updatedRooms = [...prevRooms];
//       updatedRooms[roomIndex].childrenAges[childIndex] = age;
//       return updatedRooms;
//     });
//   };

//   const handlePopupToggle = () => setShowPopup(!showPopup);

//   const addRoom = () =>
//     setRooms([...rooms, { adults: 2, children: 0, childrenAges: [] }]);

//   const deleteRoom = (roomIndex) =>
//     setRooms(rooms.filter((_, i) => i !== roomIndex));

//   const CloseDone = () => setShowPopup(false);

//   const getSummary = () => {
//     const totalRooms = rooms.length;
//     const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
//     const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);
//     return `${totalRooms} Room${
//       totalRooms > 1 ? "s" : ""
//     }, ${totalAdults} Adults${
//       totalChildren > 0 ? `, ${totalChildren} Children` : ""
//     }`;
//   };

//   // ✅ Search Handler
//   const handleSearch = () => {
//     if (showDestination && !destination) {
//       alert("Please enter a destination!");
//       return;
//     }

//     const normalizedDest = destination
//       ? destination.charAt(0).toUpperCase() +
//         destination.slice(1).toLowerCase()
//       : "";

//     const searchParams = {
//       destination: normalizedDest,
//       from: formatDate(checkInDate),
//       to: formatDate(checkOutDate),
//       rooms,
//       nights,
//     };

//     if (onSearch) {
//       onSearch(searchParams); // ✅ let parent (ViewContentPage) handle it
//     } else {
//       // ✅ fallback → navigate
//       const searchUrl = `/results?destination=${normalizedDest}&from=${formatDate(
//         checkInDate
//       )}&to=${formatDate(checkOutDate)}&rooms=${encodeURIComponent(
//         JSON.stringify(rooms)
//       )}&nights=${nights}`;

//       if (window.location.pathname === "/") {
//         router.push(searchUrl);
//       } else {
//         router.replace(searchUrl);
//       }
//     }
//   };

//   const applyDates = () => setShowDatePicker(false);

//   const cancelDates = () => {
//     setDateRange([
//       { startDate: checkInDate, endDate: checkOutDate, key: "selection" },
//     ]);
//     setShowDatePicker(false);
//   };

//   const formatDate = (date) => {
//     if (!date || isNaN(date)) return "";
//     const d = date.getDate();
//     const m = date.getMonth() + 1;
//     const y = date.getFullYear();
//     return `${d}-${m}-${y}`;
//   };

//   return (
//     <div>
//       {/* 🔹 Search Bar */}
//       <div className="search-bar">
//         {/* Destination */}
//         {showDestination && (
//           <div className="search-box">
//             <FaMapMarkerAlt className="icon" />
//             <input
//               type="text"
//               placeholder="Enter destination"
//               list="destinations"
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//             />
//             <datalist id="destinations">
//               {destinations.map((place, i) => (
//                 <option key={i} value={place} />
//               ))}
//             </datalist>
//           </div>
//         )}

//         {/* Dates */}
//         <div
//           className="search-box date-box"
//           ref={dateBoxRef}
//           onClick={() => setShowDatePicker(true)}
//         >
//           <FaCalendarAlt className="icon" />
//           <input
//             type="text"
//             readOnly
//             value={
//               checkInDate && checkOutDate
//                 ? `${formatDate(checkInDate)} -- ${formatDate(checkOutDate)}`
//                 : "Select dates"
//             }
//           />
//           {showDatePicker && (
//             <div
//               className="date-picker-popup"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <DateRange
//                 ranges={dateRange}
//                 onChange={(ranges) => {
//                   const { startDate, endDate } = ranges.selection;
//                   setCheckInDate(startDate);
//                   setCheckOutDate(endDate < startDate ? startDate : endDate);
//                   setDateRange([
//                     {
//                       startDate,
//                       endDate: endDate < startDate ? startDate : endDate,
//                       key: "selection",
//                     },
//                   ]);
//                 }}
//                 minDate={today}
//                 moveRangeOnFirstSelection={false}
//                 rangeColors={["#0071c2"]}
//               />
//               <div className="footer-buttons">
//                 <button className="cancel-btn" onClick={cancelDates}>
//                   Cancel
//                 </button>
//                 <button className="apply-btn" onClick={applyDates}>
//                   Apply
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Guests */}
//         <div className="search-box" onClick={handlePopupToggle}>
//           <FaUsers className="icon" />
//           <input type="text" value={getSummary()} readOnly />
//         </div>

//         {/* Search Button */}
//         <button className="search-btn" onClick={handleSearch}>
//           <FaSearch /> Search Hotels
//         </button>
//       </div>

//       {/* 🔹 Multi-room Popup */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup">
//             {rooms.map((room, roomIndex) => (
//               <div key={roomIndex} className="room-section">
//                 <h3>Room {roomIndex + 1}</h3>
//                 {roomIndex > 0 && (
//                   <button
//                     className="delete-room-btn"
//                     onClick={() => deleteRoom(roomIndex)}
//                   >
//                     <FaTrash /> Remove
//                   </button>
//                 )}

//                 {/* Adults */}
//                 <div className="counter">
//                   <label>Adults</label>
//                   <button
//                     onClick={() =>
//                       updateCount(roomIndex, "adults", "decrement")
//                     }
//                   >
//                     <FaMinus />
//                   </button>
//                   <span>{room.adults}</span>
//                   <button
//                     onClick={() =>
//                       updateCount(roomIndex, "adults", "increment")
//                     }
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>

//                 {/* Children */}
//                 <div className="counter">
//                   <label>Children</label>
//                   <button
//                     onClick={() =>
//                       updateCount(roomIndex, "children", "decrement")
//                     }
//                   >
//                     <FaMinus />
//                   </button>
//                   <span>{room.children}</span>
//                   <button
//                     onClick={() =>
//                       updateCount(roomIndex, "children", "increment")
//                     }
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>

//                 {/* Children Ages */}
//                 {room.children > 0 && (
//                   <div className="children-ages">
//                     {room.childrenAges.map((age, childIndex) => (
//                       <div key={childIndex} className="child-age">
//                         <label>Child {childIndex + 1} Age:</label>
//                         <select
//                           value={age || ""}
//                           onChange={(e) =>
//                             handleChildAgeChange(
//                               roomIndex,
//                               childIndex,
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">Select Age</option>
//                           {Array.from({ length: 16 }, (_, i) => i + 1).map(
//                             (num) => (
//                               <option key={num} value={num}>
//                                 {num}
//                               </option>
//                             )
//                           )}
//                         </select>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//             <button className="add-room-btn" onClick={addRoom}>
//               + Add Room
//             </button>
//             <button className="close-btn" onClick={CloseDone}>
//               Done
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
