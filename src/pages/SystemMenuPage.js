import React from "react";
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import FavoriteAlien from '../assets/images/Favorite_Alien.png';
import RightBarMainMenu from "../features/Menu/RightBarMainMenu";
import SystemContent from "../features/Menu/SystemContent";

const SystemMenuPage = () => {
  return (
  <>
  <LeftBarMainMenu username="purple-alien" profilePicture={FavoriteAlien}/>
  <SystemContent/>
  <RightBarMainMenu motto="Tak trzymaj!" streak="115" level="12"/>
  </>
  );
};

export default SystemMenuPage;
