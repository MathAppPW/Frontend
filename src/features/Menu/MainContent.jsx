import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BacgroundTwo from "../../features/Bacground/BacgroundTwo.jsx";
import axios from "axios";

import Galactic1 from "../../assets/images/galctics/1.gif";
import Galactic2 from "../../assets/images/galctics/2.gif";
import Galactic3 from "../../assets/images/galctics/3.gif";
import Galactic4 from "../../assets/images/galctics/4.gif";
import Galactic5 from "../../assets/images/galctics/5.gif";

const fallbackTitles = [
  "Dział 1", "Dział 2", "Dział 3", "Dział 4", "Dział 5",
];

const fallbackImages = [
  Galactic1, Galactic2, Galactic3, Galactic4, Galactic5,
];

const MainMenuPage = () => {
  const [chapters, setChapters] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get("/Progress/chapters", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain"
      }
    })
    .then((res) => {
      const parsed = res.data;
      console.log("Pobrany postęp:", parsed);
      const entries = Object.entries(parsed.progress);
      const dynamicChapters = entries.map(([key, value], index) => ({
        id: key,
        name: key.replaceAll("_", " ") || fallbackTitles[index],
        completed: value.subjectsCompleted,
        all: value.subjectsAll,
        image: fallbackImages[index % fallbackImages.length]
      }));      

      setChapters(dynamicChapters);
      setCurrentSection(0);
    })
    .catch((err) => {
      console.error("Błąd pobierania postępu:", err);
    });
  }, []);

  const handleScroll = (direction) => {
    setCurrentSection((prev) => {
      if (direction === "up" && prev > 0) return prev - 1;
      if (direction === "down" && prev < chapters.length - 1) return prev + 1;
      return prev;
    });
  };

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      handleScroll("down");
    } else if (event.deltaY < 0) {
      handleScroll("up");
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [chapters]);

  const handleGalaxyClick = (chapterId) => {
    navigate(`/system?section=${chapterId}`);
  };  

  const currentChapter = chapters[currentSection];

  return (
    <div className="main-content-contener">
      <BacgroundTwo />

      <div
        className={`main-content-arrow main-content-up-arrow ${currentSection === 0 ? "hidden" : ""}`}
        onClick={currentSection > 0 ? () => handleScroll("up") : undefined}
      />

      {currentChapter ? (
        <>
          <h2 className="main-content-section">{currentChapter.name}</h2>

          <img
            className="main-content-galactic"
            src={currentChapter.image}
            alt="Galaktyka"
            onClick={() => handleGalaxyClick(currentChapter.id)}
          />

          <h2 className="main-content-number">
            Ukończono: {currentChapter.completed}/{currentChapter.all}
          </h2>
        </>
      ) : (
        <h2 className="main-content-number">Wczytywanie...</h2>
      )}

      <div
        className={`main-content-arrow main-content-down-arrow ${currentSection === chapters.length - 1 ? "hidden" : ""}`}
        onClick={currentSection < chapters.length - 1 ? () => handleScroll("down") : undefined}
      />
    </div>
  );
};

export default MainMenuPage;
