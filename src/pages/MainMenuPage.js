import React from "react";
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import FavoriteAlien from '../assets/images/Favorite_Alien.png';
import RightBarMainMenu from "../features/Menu/RightBarMainMenu";
import MainContent from "../features/Menu/MainContent";

const MainMenuPage = () => {
  return (
  <>
  <LeftBarMainMenu username="purple-alien" profilePicture={FavoriteAlien}/>
  <MainContent sekcja="2" numer="1"/>
  <RightBarMainMenu motto="Tak trzymaj!" streak="115" level="12"/>
  </>
  );
};

export default MainMenuPage;
