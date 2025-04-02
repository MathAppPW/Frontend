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
  return (
    <Popup title="Zmiana statku" onClose={onClose}>
      <div className="ship-container">
        {Object.entries(ships).map(([key, src], i) => (
          <div
            key={key}
            className="ship-box"
            onClick={() => setSelectedShipId(Number(key))}
          >
            <img src={src} alt={shipNames[i]} className="ship-image" />
            <span
              className={`ship-name ${
                selectedShipId === Number(key) ? "selected" : ""
              }`}
            >
              {shipNames[i]}
            </span>
          </div>
        ))}
      </div>
      <button className="profile-save-button" onClick={onSave}>
        Zapisz zmiany
      </button>
    </Popup>
  );
};

export default ShipPopup;