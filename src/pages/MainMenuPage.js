import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import FavoriteAlien from "../assets/images/Favorite_Alien.png";
import RightBarMainMenu from "../features/Menu/RightBarMainMenu";
import SystemContent from "../features/Menu/SystemContent";

const MainMenuPage = () => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`/User/test`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          navigate("/");
        } else {
          setIsAuthChecked(true);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (!isAuthChecked) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <LeftBarMainMenu username="purple-alien" profilePicture={FavoriteAlien} />
      <SystemContent />
      <RightBarMainMenu motto="Tak trzymaj!" streak="115" level="12" />
    </>
  );
};

export default MainMenuPage;
