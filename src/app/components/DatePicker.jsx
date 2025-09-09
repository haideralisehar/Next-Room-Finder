
"use client";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styling/HotelSearchBar.css";

export default function DatePickers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [range, setRange] = useState([
    {
      startDate: today,
      endDate: addDays(today, 1),
      key: "selection",
    },
  ]);

  const [tempRange, setTempRange] = useState(range); // temp selection
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ranges) => {
    const start = new Date(ranges.selection.startDate);
    const end = new Date(ranges.selection.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    setTempRange([
      {
        startDate: start,
        endDate: end,
        key: "selection",
      },
    ]);
  };

  const handleCancel = () => {
    setTempRange(range); // reset temp to last confirmed range
    setIsOpen(false); // close popup
  };

  const handleApply = () => {
    setRange(tempRange); // confirm temp selection
    setIsOpen(false); // close popup
  };

  // dynamic minDate: past + before check-in
  const effectiveMinDate =
    tempRange[0].startDate && tempRange[0].endDate === tempRange[0].startDate
      ? today
      : tempRange[0].startDate || today;

  return (
    <div className="date-picker-wrapper">
      <input
        type="text"
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        value={`${format(range[0].startDate, "yyyy-MM-dd")} - ${format(
          range[0].endDate,
          "yyyy-MM-dd"
        )}`}
      />

      {isOpen && (
        <div className="date-range-popup">
          <DateRange
            ranges={tempRange}
            onChange={handleSelect}
            minDate={effectiveMinDate}
            rangeColors={["#0071c2"]}
            moveRangeOnFirstSelection={false}
          />

          <div className="date-footer">
            <span>
              Check in: {format(tempRange[0].startDate, "yyyy-MM-dd")} | Check
              out: {format(tempRange[0].endDate, "yyyy-MM-dd")}
            </span>
            <div className="footer-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="apply-btn" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
