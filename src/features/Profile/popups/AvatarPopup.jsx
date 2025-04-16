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
  const unlockedAvatars = [
    true, true, false, false, false,
    false, false, false, false, false
  ];

  return (
    <Popup title="Zmiana awatara" onClose={onClose}>
      <div className="avatar-container">
        {Object.entries(avatars).map(([key, src], i) => {
          const isUnlocked = unlockedAvatars[i];
          return (
            <div
              key={key}
              className="avatar-box"
              onClick={() => isUnlocked && setSelectedAvatarId(Number(key))}
            >
              <img
                src={src}
                alt={avatarNames[i]}
                className={`avatar-image ${!isUnlocked ? "locked-image" : ""}`}
              />
              <span
                className={`avatar-name ${
                  selectedAvatarId === Number(key) ? "selected" : ""
                }`}
              >
                {avatarNames[i]}
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

export default AvatarPopup;
