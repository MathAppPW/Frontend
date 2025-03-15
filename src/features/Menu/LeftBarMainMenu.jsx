import React from "react";
import { useNavigate } from "react-router-dom";

function LeftBarMainMenu(props) {
  const navigate = useNavigate();

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
          <img src={props.profilePicture} className="profile-picture" alt="Profile" />
          <p className="user-name">{props.username}</p>
        </div>

        <div className="button-container-main-menu">
          <button onClick={() => navigate("/menu")} className="button-main-menu">
            <span className="material-icons">school</span> Nauka
          </button>
          <button className="button-main-menu">
            <span className="material-icons">leaderboard</span> Ranking
          </button>
          <button className="button-main-menu">
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
