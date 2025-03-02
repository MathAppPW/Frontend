import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Bacground from "../Bacground/Bacground.jsx";

const lessonColors = {
  1: "#A020F0", // Fioletowy
  2: "#FF0000", // Czerwony
  3: "#00FF00", // Zielony
  4: "#FFA500", // Pomarańczowy
};

const lessonData = [
  "01010125", "01020250", "01030375", "01040400",
  "02010150", "02020230", "02030370", "02040490",
  "03010110", "03020240", "03030380", "03040420",
  "04010160", "04020215", "04030390", "04040700",
  "05010100", "05020100", "05030100", "05040100",
];

const taskPositions = [
  [0, 0], // Wykrzyknik
  [0, -90], [80, -43], [80, 43],
  [0, 90], [-80, 43], [-80, -43]
];

const offset = 30; // Skrócenie linii

const parseProgressData = (data, currentSection) => {
  return data.reduce((acc, entry) => {
    const section = entry.substring(0, 2);
    if (section !== String(currentSection).padStart(2, '0')) return acc;
    
    const lesson = entry.substring(2, 4);
    const task = entry.substring(4, 6);
    const progress = parseInt(entry.substring(6, 8), 10);
    
    if (!acc[lesson]) {
      acc[lesson] = { task, progress };
    }
    return acc;
  }, {});
};

const calculateLineCoords = (x1, y1, x2, y2) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return {
    x1: x1 + Math.cos(angle) * offset,
    y1: y1 + Math.sin(angle) * offset,
    x2: x2 - Math.cos(angle) * offset,
    y2: y2 - Math.sin(angle) * offset,
  };
};

const SystemMenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentSection = parseInt(searchParams.get("section")) || 1;
  const [currentLesson, setCurrentLesson] = useState(1);
  
  const parsedData = parseProgressData(lessonData, currentSection);
  const lessonKeys = Object.keys(parsedData);
  const totalLessons = lessonKeys.length;

  const handleScroll = (direction) => {
    setCurrentLesson((prev) => {
      const index = lessonKeys.indexOf(prev.toString().padStart(2, '0'));
      if (direction === "up" && index > 0) return parseInt(lessonKeys[index - 1]);
      if (direction === "down" && index < lessonKeys.length - 1) return parseInt(lessonKeys[index + 1]);
      return prev;
    });
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        handleScroll("down");
      } else if (event.deltaY < 0) {
        handleScroll("up");
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [lessonKeys]);

  const handleClick = (task) => {
    navigate(`/task?section=${currentSection}&lesson=${currentLesson}&task=${task}`);
  };

  const handleInfoClick = () => {
    navigate(`/info?section=${currentSection}&lesson=${currentLesson}`);
  };

  return (
    <div className="main-content-contener">
      <Bacground />

      {/* Strzałka do góry */}
      <div
        className={`main-content-arrow main-content-up-arrow ${currentLesson === parseInt(lessonKeys[0]) ? "hidden" : ""}`}
        onClick={currentLesson > parseInt(lessonKeys[0]) ? () => handleScroll("up") : undefined}
        style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)" }}
      />

      {/* Nagłówek z numerem lekcji */}
      <h2 className="main-content-section" style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)" }}>
        Lekcja {currentLesson}
      </h2>

      {/* Połączenia między kółkami */}
      <svg style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(2)", width: "300px", height: "300px" }}>
        {taskPositions.slice(1).map(([x1, y1], index) => {
          const [x2, y2] = taskPositions[index];
          const { x1: x1Adj, y1: y1Adj, x2: x2Adj, y2: y2Adj } = calculateLineCoords(x1, y1, x2, y2);

          const taskData = parsedData[currentLesson.toString().padStart(2, '0')];
          const isCurrentTask = taskData?.task === String(index + 1).padStart(2, '0');
          const isCompleted = parseInt(taskData?.task) > index + 1;
          const lineColor = isCurrentTask || isCompleted ? lessonColors[currentLesson] || "gray" : "rgba(100, 100, 100, 0.5)";

          return (
            <line
              key={index}
              x1={x1Adj + 150} y1={y1Adj + 150}
              x2={x2Adj + 150} y2={y2Adj + 150}
              stroke={lineColor}
              strokeWidth="3"
            />
          );
        })}
      </svg>

      {/* Kółka z zadaniami */}
      <div className="lesson-graph" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(2)" }}>
        {["!", ...Array(6).keys().map(i => i + 1)].map((taskNum, index) => {
          const taskData = parsedData[currentLesson.toString().padStart(2, '0')];
          const isCurrentTask = taskNum !== "!" && taskData?.task === String(taskNum).padStart(2, '0');
          const isCompleted = taskNum === "!" || (taskNum !== "!" && parseInt(taskData?.task) > taskNum);
          const progress = isCurrentTask ? taskData.progress : (isCompleted ? 100 : 0);
          const [x, y] = taskPositions[index];

          return (
            <div
              key={taskNum}
              className={`task-circle ${isCurrentTask || isCompleted ? "clickable" : "disabled"}`}
              onClick={taskNum === "!" ? handleInfoClick : (isCurrentTask ? () => handleClick(taskNum) : undefined)}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `3px solid ${lessonColors[currentLesson] || "gray"}`,
                padding: "5px",
                backgroundClip: "content-box",
              }}
            >
              <div
                className="task-circle-inner"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: `conic-gradient(${lessonColors[currentLesson] || "gray"} ${progress}%, transparent ${progress}%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {taskNum === "!" ? "!" : isCompleted ? "✓" : taskNum}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`main-content-arrow main-content-down-arrow ${currentLesson === Math.max(...lessonKeys.map(l => parseInt(l))) ? "hidden" : ""}`}
        onClick={currentLesson < Math.max(...lessonKeys.map(l => parseInt(l))) ? () => handleScroll("down") : undefined}
        style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
};

export default SystemMenuPage;
