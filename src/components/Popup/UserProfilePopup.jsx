import React, { useEffect, useState } from "react";
import Popup from "../../features/Profile/Popup";
import axios from "axios";

import profile0 from "../../assets/images/ProfileImages/0.png";
import profile1 from "../../assets/images/ProfileImages/1.png";
import profile2 from "../../assets/images/ProfileImages/2.png";
import profile3 from "../../assets/images/ProfileImages/3.png";
import profile4 from "../../assets/images/ProfileImages/4.png";
import profile5 from "../../assets/images/ProfileImages/5.png";
import profile6 from "../../assets/images/ProfileImages/6.png";
import profile7 from "../../assets/images/ProfileImages/7.png";
import profile8 from "../../assets/images/ProfileImages/8.png";
import profile9 from "../../assets/images/ProfileImages/9.png";

import rocket0 from "../../assets/images/RocketsImages/0.png";
import rocket1 from "../../assets/images/RocketsImages/1.png";
import rocket2 from "../../assets/images/RocketsImages/2.png";
import rocket3 from "../../assets/images/RocketsImages/3.png";
import rocket4 from "../../assets/images/RocketsImages/4.png";
import Loading from "../Loading/Loading";

const avatarImages = {
  0: profile0,
  1: profile1,
  2: profile2,
  3: profile3,
  4: profile4,
  5: profile5,
  6: profile6,
  7: profile7,
  8: profile8,
  9: profile9,
};

const rocketImages = {
  0: rocket0,
  1: rocket1,
  2: rocket2,
  3: rocket3,
  4: rocket4,
};

const UserProfilePopup = ({ username, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [invitationSent, setInvitationSent] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios.get(`/Search/search-verbose/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Odpowiedź z /search-verbose:", res);
        setUserData(res.data);
      })
      .catch((err) => console.error("Błąd profilu:", err));
  }, [username]);


  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`/Friends/new/${username}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Odpowiedź z serwera:", response);
      setInvitationSent(true);
    } catch (error) {
      console.error("Błąd dodawania znajomego:", error);
    }
  };



  const handleRemoveFriend = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/Friends/removeFriend/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData((prev) => ({ ...prev, isFriend: false }));
    } catch (error) {
      console.error("Błąd usuwania znajomego:", error);
    }
  };

  if (!userData) {
    return (
      <Popup onClose={onClose}>
        <Loading/>
      </Popup>
    );
  }

  const {
    level,
    profileSkin,
    rocketSkin,
    streak,
    maxStreak,
    exercisesCompleted,
    isFriend,
    friendRequestSent,
  } = userData;

  return (
    <Popup onClose={onClose}>
      <div className="user-profile-popup">
        <div className="user-info-container">
          <div className="user-left">
            <div className="user-upper">
              <div className="user-avatar-wrapper">
                <img src={avatarImages[profileSkin]} alt="avatar" className="user-avatar" />
                <p className="user-nickname">{username}</p>
              </div>

              <div className="user-stats-section">
                <p>Level: {level}</p>
                <p>Obecny streak: {streak} dni</p>
                <p>Najdłuższy streak: {maxStreak} dni</p>
                <p>Liczba zrobionych zadań: {exercisesCompleted}</p>
              </div>
            </div>

            <div className="user-buttons">
              {friendRequestSent ? (
                <p style={{ color: "lightgreen", fontSize: "1.3vh", fontFamily: "Orbitron" }}>
                  ✅ Wysłano zaproszenie
                </p>
              ) : (isFriend) ? (
                <button className="friend-button-r" onClick={handleRemoveFriend}>
                  − Usuń ze znajomych
                </button>
              ) : invitationSent ? (
                <p style={{ color: "lightgreen", fontSize: "1.3vh", fontFamily: "Orbitron" }}>
                  ✅ Wysłano zaproszenie
                </p>
              ) : (
                <button className="friend-button" onClick={handleAddFriend}>
                  + Dodaj do znajomych
                </button>
              )}
            </div>
          </div>

          <div className="user-rocket-section">
            <img src={rocketImages[rocketSkin]} alt="rakieta" className="user-rocket" />
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default UserProfilePopup;