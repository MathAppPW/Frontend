import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './MiniCalendar.css';

function MiniCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="mini-calendar">
      <p className="month">Grudzień</p>
      <Calendar
        onChange={setDate}
        value={date}
        maxDetail="month"
        showNeighboringMonth={false}
        showNavigation={false} // Hide navigation bar
      />
    </div>
  );
}

export default MiniCalendar;
