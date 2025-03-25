import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bacground from "../../features/Bacground/Bacground.jsx";

import Galactic1 from "../../assets/images/galctics/1.gif";
import Galactic2 from "../../assets/images/galctics/2.gif";
import Galactic3 from "../../assets/images/galctics/3.gif";
import Galactic4 from "../../assets/images/galctics/4.gif";
import Galactic5 from "../../assets/images/galctics/5.gif";

const sectionsCount = 5;

const MainMenuPage = () => {
  const galaxies = [
    { name: "Wyrażenia algebraiczne", image: Galactic1 },
    { name: "Funkcja liniowa", image: Galactic2 },
    { name: "Funkcja kwadratowa", image: Galactic3 },
    { name: "Ciągi liczbowe", image: Galactic4 },
    { name: "Planimetria", image: Galactic5 },
  ];

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

  const currentGalaxy = galaxies[currentSection - 1];


  return (
    <div className="main-content-contener">
      
      <Bacground />
        <div
        className={`main-content-arrow main-content-up-arrow ${currentSection === 1 ? "hidden" : ""}`}
        onClick={currentSection > 1 ? () => handleScroll("up") : undefined}
        />
            <h2 className="main-content-section">  {currentGalaxy.name}</h2>
            <img
            className="main-content-galactic"
            src={currentGalaxy.image}
            alt="Galaktyka"
            onClick={() => handleGalaxyClick(currentSection)}
            />
            <h2 className="main-content-number">Ukończono: 1/5</h2>

        <div
        className={`main-content-arrow main-content-down-arrow ${currentSection === sectionsCount ? "hidden" : ""}`}
        onClick={currentSection < sectionsCount ? () => handleScroll("down") : undefined}
        />
    </div>
  );
};

export default MainMenuPage;
