import React from "react";
import Popup from "../Popup";

const AvatarPopup = ({
  avatars,
  avatarNames,
  selectedAvatarId,
  setSelectedAvatarId,
  onSave,
  onClose
}) => {
  return (
    <Popup title="Zmiana awatara" onClose={onClose}>
      <div className="avatar-container">
        {Object.entries(avatars).map(([key, src], i) => (
          <div
            key={key}
            className="avatar-box"
            onClick={() => setSelectedAvatarId(Number(key))}
          >
            <img src={src} alt={avatarNames[i]} className="avatar-image" />
            <span
              className={`avatar-name ${
                selectedAvatarId === Number(key) ? "selected" : ""
              }`}
            >
              {avatarNames[i]}
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

export default AvatarPopup;
