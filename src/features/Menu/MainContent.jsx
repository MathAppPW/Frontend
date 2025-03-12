import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Galactic from "../../assets/images/Galactic.png";
import Bacground from "../../features/Bacground/Bacground.jsx";


const sectionsCount = 5;

const MainMenuPage = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    setCurrentSection((prev) => {
      if (direction === "up" && prev > 1) return prev - 1;
      if (direction === "down" && prev < sectionsCount) return prev + 1;
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
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleGalaxyClick = (sectionNumber) => {
    navigate(`/system?section=${sectionNumber}`);
  };

  return (
    <div className="main-content-contener">
      <Bacground />
        <div
        className={`main-content-arrow main-content-up-arrow ${currentSection === 1 ? "hidden" : ""}`}
        onClick={currentSection > 1 ? () => handleScroll("up") : undefined}
        />
            <h2 className="main-content-section">LICZBY
            RZECZYWISTE {currentSection}</h2>
            <img
            className="main-content-galactic"
            src={Galactic}
            alt="Galaktyka"
            onClick={() => handleGalaxyClick(currentSection)}
            />
            <h2 className="main-content-number">1/5</h2>

        <div
        className={`main-content-arrow main-content-down-arrow ${currentSection === sectionsCount ? "hidden" : ""}`}
        onClick={currentSection < sectionsCount ? () => handleScroll("down") : undefined}
        />
    </div>
  );
};

export default MainMenuPage;
