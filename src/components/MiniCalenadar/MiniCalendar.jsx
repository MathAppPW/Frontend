import React, { useState, useEffect } from "react";
import "./MiniCalendar.css";
import axios from "axios";

const customWeekdays = ["PN", "WT", "ŚR", "CZ", "PT", "S", "N"];

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedRanges, setMarkedRanges] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get("/Streak/callendar", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/plain",
        },
      })
      .then((res) => {
        const parsed = res.data;

        if (!Array.isArray(parsed)) return;

        const toDateOnly = (str) => {
          const d = new Date(str);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const converted = parsed.map((item) => ({
          start: toDateOnly(item.start),
          end: toDateOnly(item.end),
        }));

        setMarkedRanges(converted);
      });
  }, []);

  const isInRange = (date, range) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d >= range.start && d <= range.end;
  };

  const getDaysInMonth = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        isToday: date.toDateString() === new Date().toDateString(),
        isHighlighted: markedRanges.some((range) => isInRange(date, range)),
      });
    }

    return days;
  };

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>❮</button>
        <span>
          {currentDate.toLocaleString("pl-PL", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </span>
        <button onClick={() => changeMonth(1)}>❯</button>
      </div>
      <div className="weekdays">
        {customWeekdays.map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {days.map((day, index) =>
          day ? (
            <div
              key={index}
              className={`day${day.isToday ? " today" : ""}${
                day.isHighlighted ? " highlighted" : ""
              }`}
            >
              {day.day}
            </div>
          ) : (
            <div key={index} className="day empty"></div>
          )
        )}
      </div>
    </div>
  );
}

export default MiniCalendar;