import React from "react";
import { Bar } from "react-chartjs-2";

const TimeChart = ({ data, range, onFilterChange, formatLabel }) => {
  return (
    <div className="charts-column" style={{ position: "relative", flexGrow: 1 }}>
      <div className="chart-box">
        <Bar
          data={{
            labels: data.map(d => formatLabel(range, d.date)),
            datasets: [
              {
                label: "Czas w minutach",
                data: data.map(d => Math.round(d.secondsSpent / 60)),
                backgroundColor: "#AD15FF",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5
              }
            ]
          }}
          options={{
            plugins: {
              legend: {
                position: "top",
                labels: { color: "white" }
              },
              title: {
                display: true,
                text: "Czas poświęcony na zadania",
                color: "white",
                font: { size: 16 },
                padding: { top: 15 }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: { color: "white", maxRotation: 45, minRotation: 45 },
                grid: { color: "rgba(255, 255, 255, 0.1)" }
              },
              y: {
                beginAtZero: true,
                ticks: { color: "white" },
                grid: { color: "rgba(255, 255, 255, 0.1)" }
              }
            }
          }}
        />
      </div>
      <div className="chart-filter" style={{ position: "absolute", right: "10px", top: "10px" }}>
        <select value={range} onChange={(e) => onFilterChange(e.target.value)} className="task-filter">
          <option value="week">Ostatni tydzień</option>
          <option value="8weeks">Ostatnie 8 tygodni</option>
          <option value="month">Ostatnie 12 miesięcy</option>
        </select>
      </div>
    </div>
  );
};

export default TimeChart;
