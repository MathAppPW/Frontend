import React, { useEffect, useRef } from "react";
import "./backgroundTwo.css";

function BackgroundTwo() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene) {
      for (let i = 0; i < 85; i++) {
        const div = document.createElement("div");

        // Dodaj losowy rozmiar
        const rand = Math.random();
        if (rand < 0.43) {
          div.className = "small-star";
        } else if (rand < 0.76) {
          div.className = "medium-star";
        } else {
          div.className = "large-star";
        }

        scene.appendChild(div);
      }

      const stars = scene.querySelectorAll("div");
      stars.forEach((star) => {
        let x = `${Math.random() * 300}vmax`;
        let y = `${Math.random() * 100}vh`;
        let z = `${Math.random() * 100}vmin`;
        let rx = `${Math.random() * 360}deg`;

        star.style.setProperty("--x", x);
        star.style.setProperty("--y", y);
        star.style.setProperty("--z", z);
        star.style.setProperty("--rx", rx);

        let delay = `${Math.random() * 9}s`;
        star.style.animationDelay = delay;
      });
    }
  }, []);

  return <div className="scene" ref={sceneRef}></div>;
}

export default BackgroundTwo;
