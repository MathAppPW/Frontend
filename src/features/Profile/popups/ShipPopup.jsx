import React from "react";
import Popup from "../Popup";

const ShipPopup = ({
  ships,
  shipNames,
  selectedShipId,
  setSelectedShipId,
  onSave,
  onClose
}) => {
  const unlockedShips = [true, false, false, false, false];

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
