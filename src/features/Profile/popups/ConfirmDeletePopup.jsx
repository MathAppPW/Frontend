import React from "react";
import Popup from "../Popup";

const ConfirmDeletePopup = ({ onClose }) => {
  return (
    <Popup title="Czy usunąć?" onClose={onClose}>
      <div className="confirmation-popup">
        <div className="confirmation-buttons">
          <button className="profile-change-button" onClick={onClose}>NIE</button>
        </div>
        <p>
          By usunąć konto wpisz <strong>swoje hasło</strong>, a następnie kliknij przycisk poniżej.
        </p>
        <input type="password" className="confirm-input" />
        <button className="delete-button">Usuń konto</button>
      </div>
    </Popup>
  );
};

export default ConfirmDeletePopup;
