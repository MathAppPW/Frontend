import React, { useState } from "react";
import Popup from "./Popup";

const ProfileContent = () => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAvatarOpen, setAvatarOpen] = useState(false);
  const [isShipOpen, setShipOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const importAll = (context) => {
    let images = {};
    context.keys().forEach((item) => {
      const name = item.replace("./", "").replace(".png", "");
      images[name] = context(item);
    });
    return images;
  };
  
  const allAvatars = importAll(require.context("../../assets/images/ProfileImages", false, /\.png$/));
  const avatarOrder = [
    "noob", "noob2", "level", "level2", 
    "friend", "task", "task2", "streak", 
    "streak2", "top-ranking"
  ];
  const avatars = avatarOrder.reduce((ordered, name) => {
    if (allAvatars[name]) ordered[name] = allAvatars[name];
    return ordered;
  }, {});

  const allShips = importAll(require.context("../../assets/images/RocketsImages", false, /\.png$/));
  const shipOrder = ["noob", "level", "friend", "task", "streak"];
  const ships = shipOrder.reduce((ordered, name) => {
    if (allShips[name]) ordered[name] = allShips[name];
    return ordered;
  }, {});

  return (
    <div className="profile-content">
      <div className="profile-container">
        <div className="profile-left">
          <button className="profile-button" onClick={() => setEditOpen(true)}>Edytuj dane konta</button>
          <button className="profile-button" onClick={() => setAvatarOpen(true)}>Zmień awatar</button>
          <button className="profile-button" onClick={() => setShipOpen(true)}>Zmień statek</button>
        </div>

        <div className="profile-right">
          <div className="profile-stats">
            <p><strong>Zrobione zadania:</strong> 134</p>
            <p><strong>Najlepszy streak:</strong> 231</p>
            <p><strong>Czas:</strong> 30h</p>
          </div>
        </div>
      </div>
      
      <div className="profile-charts">
        <div className="chart-box">
          Wykres ilości zadań zrobionych danego dnia w danym tygodniu/miesiącu/roku
        </div>
        <div className="chart-box">
          Wykres ilości czasu poświęconego danego dnia w danym tygodniu/miesiącu/roku
        </div>
      </div>
      
      {/* Popup Edycji Konta */}
      {isEditOpen && (
        <Popup title="Edycja konta" onClose={() => setEditOpen(false)} width="400px">
          <div className="edit-field">
            <span className="edit-label">Nazwa użytkownika:</span>
            <button className="edit-button">Edytuj</button>
          </div>
          <div className="edit-field">
            <span className="edit-label">Adres e-mail:</span>
            <button className="edit-button">Edytuj</button>
          </div>
          <div className="edit-field">
            <span className="edit-label">Hasło:</span>
            <button className="edit-button">Edytuj</button>
          </div>

          <div className="save-buttons">
            <button className="profile-save-button">Zapisz zmiany</button>
            <button className="profile-save-button">Cofnij</button>
          </div>

          <div className="delete-section">
            <h2>Usunięcie konta</h2>
            <p>Usuwasz konto na własną odpowiedzialność, stracisz cały postęp.</p>
            <button className="delete-button" onClick={() => setDeleteConfirmOpen(true)}>Usuń konto</button>
          </div>
        </Popup>
      )}

      {/* Popup Potwierdzenia Usunięcia Konta */}
      {isDeleteConfirmOpen && (
        <Popup title="Na pewno chcesz usunąć konto?" onClose={() => setDeleteConfirmOpen(false)} width="350px">
          <div className="confirmation-popup">
            <button className="profile-change-button">NIE</button>
            <p>By usunąć konto wpisz <strong>"POTWIERDZAM"</strong>, a następnie kliknij przycisk poniżej.</p>
            <input type="text" className="confirm-input" placeholder="PO..." />
            <button className="delete-button">Usuń konto</button>
          </div>
        </Popup>
      )}


      {/* Popup Zmiany Awatara */}
      {isAvatarOpen && (
        <Popup title="Zmiana awatara" onClose={() => setAvatarOpen(false)}>
            <div className="avatar-container">
            {Object.entries(avatars).map(([name, src]) => (
                <div key={name} className="avatar-box">
                <img src={src} alt={name} className="avatar-image" />
                <span className="avatar-name">{name}</span>
                </div>
            ))}
            </div>
            <button className="profile-save-button">Zapisz zmiany</button>
        </Popup>
        )}


      {/* Popup Zmiany Statku */}
      {isShipOpen && (
        <Popup title="Zmiana statku" onClose={() => setShipOpen(false)}>
            <div className="ship-container">
            {Object.entries(ships).map(([name, src]) => (
                <div key={name} className="ship-box">
                <img src={src} alt={name} className="ship-image" />
                <span className="ship-name">{name}</span>
                </div>
            ))}
            </div>
            <button className="profile-save-button">Zapisz zmiany</button>
        </Popup>
        )}
    </div>
  );
};

export default ProfileContent;
