import React from "react";
import Popup from "../Popup";

const EditPopup = ({
  onClose,
  onNameEdit,
  onEmailEdit,
  onPasswordEdit,
  onDeleteConfirm,
  username,
  email,
  onSave,
  pendingChanges,
  errorMessage,
}) => {
  return (
    <Popup title="Edycja konta" onClose={onClose}>
      <div className="edit-popup">
        <div className="edit-field">
          <div className="edit-label-value">
            <span className="edit-label">Nazwa użytkownika:</span>
            <span className="edit-value">{pendingChanges.newUsername || username}</span>
          </div>
          <button className="edit-button" onClick={onNameEdit}>Edytuj</button>
        </div>

        <div className="edit-field">
          <div className="edit-label-value">
            <span className="edit-label">Adres e-mail:</span>
            <span className="edit-value">{pendingChanges.newEmail || email}</span>
          </div>
          <button className="edit-button" onClick={onEmailEdit}>Edytuj</button>
        </div>

        <div className="edit-field">
          <div className="edit-label-value">
            <span className="edit-label">Hasło:</span>
            <span className="edit-value">••••••••••</span>
          </div>
          <button className="edit-button" onClick={onPasswordEdit}>Edytuj</button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="save-buttons">
          <button className="profile-save-button" onClick={onSave}>Zapisz zmiany</button>
          <button className="profile-save-button" onClick={onClose}>Cofnij</button>
        </div>
        
        <div className="delete-section">
          <h2>Usunięcie konta</h2>
          <p>Usuwasz konto na własną odpowiedzialność, stracisz cały postęp.</p>
          <button className="delete-button" onClick={onDeleteConfirm}>Usuń konto</button>
        </div>
      </div>
    </Popup>
  );
};

export default EditPopup;
