import React, { useState } from "react";
import Popup from "../Popup";
import { useNavigate } from "react-router-dom";

const ConfirmDeletePopup = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("/User/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resetId: "X",
          password: password
        })
      });

      if (!response.ok) {
        setError("Niepoprawne hasło.");
        return;
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("resetId");
      navigate("/");

    } catch (err) {
      console.error("Błąd usuwania konta:", err);
      setError("Wystąpił błąd sieci.");
    }
  };

  return (
    <Popup title="Czy usunąć?" onClose={onClose}>
      <div className="confirmation-popup">
        <div className="confirmation-buttons">
          <button className="profile-change-button" onClick={onClose}>NIE</button>
        </div>
        <p>
          By usunąć konto wpisz <strong>swoje hasło</strong>, a następnie kliknij przycisk poniżej.
        </p>
        <input type="password" className="confirm-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
        {error && <div className="error-message">{error}</div>}
        <button className="delete-button" onClick={handleDelete}>Usuń konto</button>
      </div>
    </Popup>
  );
};

export default ConfirmDeletePopup;
