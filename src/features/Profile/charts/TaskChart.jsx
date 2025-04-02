import React from "react";
import { Bar } from "react-chartjs-2";

const TaskChart = ({ data, range, onFilterChange, formatLabel }) => {
  return (
    <div className="charts-column" style={{ position: "relative", flexGrow: 1 }}>
      <div className="chart-box">
        <Bar
          data={{
            labels: data.map(d => formatLabel(range, d.date)),
            datasets: [
              {
                label: "Złe",
                data: data.map(d => d.exercisesCountFailed),
                backgroundColor: "#FF4C8B",
                stack: "zadania",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 5
              },
              {
                label: "Dobre",
                data: data.map(d => d.exercisesCountSuccessful),
                backgroundColor: "#2BF8D6",
                stack: "zadania",
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
                labels: { color: "white" },
                reverse: true
              },
              title: {
                display: true,
                text: "Liczba zrobionych zadań",
                color: "white",
                font: { size: 16 },
                padding: { top: 15 }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                ticks: { color: "white", maxRotation: 45, minRotation: 45 },
                grid: { color: "rgba(255, 255, 255, 0.1)" }
              },
              y: {
                stacked: true,
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

export default TaskChart;
