import React, { useEffect, useRef } from "react";
import "./background.css";

function Bacground() {
  const sceneRef = useRef(null); // Referencja do elementu .scene

  useEffect(() => {
    const scene = sceneRef.current; // Bezpośredni dostęp do elementu
    if (scene) {
      // Tworzenie 210 <div>
      for (let i = 0; i < 210; i++) {
        const div = document.createElement("div");
        scene.appendChild(div);
      }

      // Pobieranie wszystkich <div> stworzonych w .scene
      const stars = scene.querySelectorAll("div");
      stars.forEach((star) => {
        let x = `${Math.random() * 200}vmax`;
        let y = `${Math.random() * 100}vh`;
        let z = `${Math.random() * 100}vmin`;
        let rx = `${Math.random() * 360}deg`;

        star.style.setProperty('--x', x);
        star.style.setProperty('--y', y);
        star.style.setProperty('--z', z);
        star.style.setProperty('--rx', rx);

        let delay = `${Math.random() * 1.5}s`;
        star.style.animationDelay = delay;
      });
    }
  }, []); // Wykona się tylko raz po zamontowaniu komponentu

  return (
    <>
      <div className="scene" ref={sceneRef}></div> {/* Kontener dla divów */}
    </>
  );
}

export default Bacground;
