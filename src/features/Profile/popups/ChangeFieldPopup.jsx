import React, { useState } from "react";
import Popup from "../Popup";

const ChangeFieldPopup = ({ title, label, isPassword = false, onSave, onClose }) => {
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!newValue || !confirmValue) {
        setError("Oba pola muszą być wypełnione.");
        return;
    }
    if (newValue !== confirmValue) {
      setError("Wprowadzone wartości się różnią.");
      return;
    }
    setError("");
    onSave(newValue);
  };

  return (
    <Popup title={title} onClose={onClose}>
      <div className="change-field-popup">
        <div className="change-field-group">
          <label className="change-field-label">{label}</label>
          <input
            className="change-field-input"
            type={isPassword ? "password" : "text"}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
        <div className="change-field-group">
          <label className="change-field-label">Powtórz {label.toLowerCase()}</label>
          <input
            className="change-field-input"
            type={isPassword ? "password" : "text"}
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="save-buttons">
          <button className="profile-save-button" onClick={handleSubmit}>
            Zapisz
          </button>
          <button className="profile-save-button" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ChangeFieldPopup;
