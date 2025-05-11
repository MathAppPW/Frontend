import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BacgroundTwo from "../Bacground/BacgroundTwo.jsx";
import axios from "axios";

const lessonColors = {
  1: "#A020F0", // fioletowy
  2: "#FF0000", // czerwony
  3: "#00FF00", // zielony
  4: "#FFA500", // pomarańczowy
  5: "#0000FF", // niebieski
  6: "#FF69B4", // różowy
};

const taskPositions = [
  [0, 0],
  [0, -90], [80, -43], [80, 43],
  [0, 90], [-80, 43], [-80, -43],
];

const offset = 30;
const cut = (x1, y1, x2, y2) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return {
    x1: x1 + Math.cos(a) * offset,
    y1: y1 + Math.sin(a) * offset,
    x2: x2 - Math.cos(a) * offset,
    y2: y2 - Math.sin(a) * offset,
  };
};

export default function SystemMenuPage() {
  const navigate = useNavigate();
  const chapter = new URLSearchParams(useLocation().search).get("section");

  const [map, setMap] = useState({});
  const [keys, setKeys] = useState([]);
  const [curIndex, setCurIndex] = useState(0);

  useEffect(() => {
    if (!chapter) return;

    const token = localStorage.getItem("accessToken");

    console.log("Wysyłam zapytanie GET na:", `/Progress/subjects/${chapter}`);

    axios.get(`/Progress/subjects/${chapter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      }
    })
    .then(res => {
      const raw = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      console.log("Odpowiedź z serwera:", raw);

      const m = {};
      const titles = Object.keys(raw.progress ?? {});

      titles.forEach((title, idx) => {
        const v = raw.progress[title];
        const task = Math.min(v.currentLesson ?? 1, 7);
        const progress = (v.seriesAll ?? 0)
          ? Math.round((v.seriesCompleted / v.seriesAll) * 100)
          : 0;

        m[title] = {
          task: task,
          progress,
          color: lessonColors[(idx % 6) + 1] || "gray",
        };
      });

      /*
      m["Testowy temat"] = {
        task: 2,          // pierwszy task aktywny
        progress: 1,         // 0% ukończenia
        color: "#00CED1",    // turkusowy
      };
      titles.push("Testowy temat");
      */

      setMap(m);
      setKeys(titles);
      setCurIndex(0);
    })
    .catch(e => console.error("Błąd pobierania lessons:", e));
  }, [chapter]);

  /* ----------- scrollowanie ----------- */
  const scroll = dir => setCurIndex(prev => {
    if (dir === "up" && prev > 0) return prev - 1;
    if (dir === "down" && prev < keys.length - 1) return prev + 1;
    return prev;
  });

  useEffect(() => {
    const onWheel = e => scroll(e.deltaY > 0 ? "down" : "up");
    window.addEventListener("wheel", onWheel);
    return () => window.removeEventListener("wheel", onWheel);
  }, [keys]);

  /* ----------- kliknięcia ----------- */
  const goTask = (taskNum) => {
    const lessonName = keys[curIndex];
    navigate(`/task?section=${chapter}&lesson=${lessonName}&task=${taskNum}`);
  };

  const goInfo = () => {
    const lessonName = keys[curIndex];
    navigate(`/info?section=${chapter}&lesson=${lessonName}`);
  };

  /* ----------- render ----------- */
  const title = keys[curIndex] ? keys[curIndex].replaceAll("_", " ") : "Wczytywanie..."; // tutaj zamieniamy _ na spację
  const d = map[keys[curIndex]] || {};
  const currentColor = d.color || "gray";

  return (
    <div className="main-content-contener">
      <BacgroundTwo />

      {/* strzałka ↑ */}
      <div
        className={`main-content-arrow main-content-up-arrow ${curIndex === 0 ? "hidden" : ""}`}
        onClick={curIndex > 0 ? () => scroll("up") : undefined}
        style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)" }}
      />

      {/* nagłówek */}
      <h2 className="main-content-section"
          style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)" }}>
        {title}
      </h2>

      {/* linie */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%) scale(2)",
          width: 300,
          height: 300,
        }}
      >
        {taskPositions.slice(1).map(([x1, y1], i) => {
          const [x2, y2] = taskPositions[i];
          const { x1: xa, y1: ya, x2: xb, y2: yb } = cut(x1, y1, x2, y2);

          const on = d.task === (i + 1);
          const ok = (d.task || 1) > i + 1;
          const c = on || ok ? currentColor : "rgba(100,100,100,.5)";

          return (
            <line
              key={i}
              x1={xa + 150}
              y1={ya + 150}
              x2={xb + 150}
              y2={yb + 150}
              stroke={c}
              strokeWidth="3"
            />
          );
        })}
      </svg>

      {/* kółka */}
      <div
        className="lesson-graph"
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%) scale(2)",
        }}
      >
        {["!", ...Array(6).fill(0).map((_, i) => i + 1)].map((n, idx) => {
          const isTask = n !== "!";
          const on = isTask && d.task === n;
          const ok = !isTask || (d.task || 1) > n;
          const pct = on ? d.progress : (ok ? 100 : 0);
          const [x, y] = taskPositions[idx];

          return (
            <div
              key={n}
              className={`task-circle ${on || ok ? "clickable" : "disabled"}`}
              onClick={n === "!" ? goInfo : on ? () => goTask(n) : undefined}
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
                border: `3px solid ${currentColor}`,
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
                  background: `conic-gradient(${currentColor} ${pct}%, transparent ${pct}%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {n === "!" ? "!" : ok ? "✓" : n}
              </div>
            </div>
          );
        })}
      </div>

      {/* strzałka ↓ */}
      <div
        className={`main-content-arrow main-content-down-arrow ${curIndex === keys.length - 1 ? "hidden" : ""}`}
        onClick={curIndex < keys.length - 1 ? () => scroll("down") : undefined}
        style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}
