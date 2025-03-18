import React, { useState } from "react";
import "./MiniCalendar.css";

const customWeekdays = ["PN", "WT", "ŚR", "CZ", "PT", "S", "N"];

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Domyślnie obecny miesiąc

  // Zakres zaznaczonych dni
  const markedRanges = [
    { start: new Date(2024, 11, 3), end: new Date(2024, 11, 3) },
    { start: new Date(2024, 11, 6), end: new Date(2024, 11, 10) },
    { start: new Date(2025, 2, 10), end: new Date(2025, 2, 15) },
  ];

  // Funkcja do sprawdzania, czy dzień jest w zaznaczonym zakresie
  const isInRange = (date, range) => {
    return date >= range.start && date <= range.end;
  };

  // Funkcja do generowania dni w miesiącu
  const getDaysInMonth = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay() || 7; // Dopasowanie dla poniedziałku
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Dodawanie pustych miejsc na dni przed pierwszym dniem miesiąca
    for (let i = 1; i < firstDay; i++) {
      days.push(null);
    }

    // Dodawanie dni miesiąca
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        isToday:
          date.toDateString() === new Date().toDateString(), // Sprawdzanie, czy to obecny dzień
        isHighlighted: markedRanges.some(range => isInRange(date, range)),
      });
    }

    return days;
  };

  // Funkcja zmiany miesiąca
  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

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
              className={`day ${
                day.isToday ? "today" : day.isHighlighted ? "highlighted" : ""
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
