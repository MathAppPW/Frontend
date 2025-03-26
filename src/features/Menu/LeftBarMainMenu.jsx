import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import profile0 from '../../assets/images/ProfileImages/0.png';
import profile1 from '../../assets/images/ProfileImages/1.png';
import profile2 from '../../assets/images/ProfileImages/2.png';
import profile3 from '../../assets/images/ProfileImages/3.png';
import profile4 from '../../assets/images/ProfileImages/4.png';
import profile5 from '../../assets/images/ProfileImages/5.png';
import profile6 from '../../assets/images/ProfileImages/6.png';
import profile7 from '../../assets/images/ProfileImages/7.png';
import profile8 from '../../assets/images/ProfileImages/8.png';
import profile9 from '../../assets/images/ProfileImages/9.png';




function LeftBarMainMenu(props) {
  const navigate = useNavigate();
  const username = useSelector((state) => state.userName);
  const profilePicture = useSelector((state) => state.profilePicture);

  const profileImages = {
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


  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");


    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`/User/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>

      <div className="bar-main-menu left-bar-main-menu">
        <h1 className="app-title-main">SpaceMath</h1>

        <div className="profile">
          <img src={profileImages[profilePicture]} className="profile-picture" alt="Profile" />
          <p className="user-name">{username}</p>
        </div>

        <div className="button-container-main-menu">
          <button onClick={() => navigate("/menu")} className="button-main-menu">
            <span className="material-icons">school</span> Nauka
          </button>
          <button className="button-main-menu">
            <span className="material-icons">leaderboard</span> Ranking
          </button>
          <button className="button-main-menu" onClick={() => navigate("/friends")}>
            <span className="material-icons">group</span> Znajomi
          </button>
          <button onClick={() => navigate("/profile")} className="button-main-menu">
            <span className="material-icons">person</span> Profil
          </button>
          <button className="button-main-menu">
            <span className="material-icons">settings</span> Ustawienia
          </button>
        </div>

        <button className="button-log-out" onClick={handleLogout}>Wyloguj</button>
      </div>

      <div className="borrder-menu right-borrder-menu-top"></div>
      <div className="borrder-menu right-borrder-menu-bottom"></div>
    </>
  );
}

export default LeftBarMainMenu;
