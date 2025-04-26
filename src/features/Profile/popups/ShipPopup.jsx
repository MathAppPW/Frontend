import React, { useEffect, useState } from "react";
import Popup from "../Popup";
import axios from "axios";

const ShipPopup = ({
  ships,
  shipNames,
  selectedShipId,
  setSelectedShipId,
  onSave,
  onClose
}) => {
  const [unlockedShips, setUnlockedShips] = useState(new Array(5).fill(false));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get("/Achievements/rocket", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain"
      }
    })
    .then((res) => {
      const data = res.data;
      //console.log("Osiągnięcia statku:", data.isUnlocked);
      if (data.isUnlocked && Array.isArray(data.isUnlocked)) {
        setUnlockedShips(data.isUnlocked);
      } else {
        console.warn("Nieprawidłowy format danych:", data);
      }
    })
    .catch((err) => {
      console.error("Błąd pobierania osiągnięć rakiety:", err);
    });
  }, []);

  return (
    <Popup title="Zmiana statku" onClose={onClose}>
      <div className="ship-container">
        {Object.entries(ships).map(([key, src], i) => {
          const isUnlocked = unlockedShips[i];
          return (
            <div
              key={key}
              className="ship-box"
              onClick={() => isUnlocked && setSelectedShipId(Number(key))}
            >
              <img
                src={src}
                alt={shipNames[i]}
                className={`ship-image ${!isUnlocked ? "locked-image" : ""}`}
              />
              <span
                className={`ship-name ${
                  selectedShipId === Number(key) ? "selected" : ""
                }`}
              >
                {shipNames[i]}
              </span>
            </div>
          );
        })}
      </div>
      <button className="profile-save-button" onClick={onSave}>
        Zapisz zmiany
      </button>
    </Popup>
  );
};

export default ShipPopup;
