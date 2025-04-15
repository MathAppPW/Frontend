import React, { useState } from "react";
import Popup from "../Popup";

const ChangeFieldPopup = ({
  title,
  label,
  isPassword = false,
  onSave,
  onClose
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    setError("");

    if (!newValue || !confirmValue || (isPassword && !oldPassword)) {
      setError("Wszystkie pola muszą być wypełnione.");
      return;
    }

    if (newValue !== confirmValue) {
      setError("Wprowadzone wartości się różnią.");
      return;
    }

    if (isPassword && !isValidPassword(newValue)) {
      setError("Hasło musi mieć min. 8 znaków, wielką i małą literę, cyfrę i znak specjalny.");
      return;
    }

    try {
      if (isPassword) {
        onSave({ oldPassword, newPassword: newValue });
      } else {
        onSave(newValue);
      }
      onClose();
    } catch (err) {
      console.error("Błąd zmiany pola:", err);
      setError("Wystąpił błąd podczas aktualizacji.");
    }
  };

  return (
    <Popup title={title} onClose={onClose}>
      <div className="change-field-popup">
        {isPassword && (
          <div className="change-field-group">
            <label className="change-field-label">Obecne hasło</label>
            <input
              className="change-field-input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        )}
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
          <button className="profile-save-button" onClick={handleSubmit}>Zapisz</button>
          <button className="profile-save-button" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </Popup>
  );
};

export default ChangeFieldPopup; 