import React, { useEffect, useState } from "react";
import Popup from "../Popup";
import axios from "axios";

const AvatarPopup = ({
  avatars,
  avatarNames,
  selectedAvatarId,
  setSelectedAvatarId,
  onSave,
  onClose
}) => {
  const [unlockedAvatars, setUnlockedAvatars] = useState(
    new Array(10).fill(false)
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get("/Achievements/avatar", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain"
      }
    })
    .then((res) => {
      const data = res.data;
      //console.log("Osiągnięcia awatara:", data.isUnlocked);
      if (data.isUnlocked && Array.isArray(data.isUnlocked)) {
        setUnlockedAvatars(data.isUnlocked);
      } else {
        console.warn("Nieprawidłowy format danych:", data);
      }
    })
    .catch((err) => {
      console.error("Błąd pobierania osiągnięć awatara:", err);
    });
  }, []);

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
