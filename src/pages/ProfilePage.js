import React from "react";
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import FavoriteAlien from '../assets/images/Favorite_Alien.png';
import RightBarMainMenu from "../features/Menu/RightBarMainMenu";
import ProfileContent from "../features/Profile/ProfileContent";

const ProfilePage = () => {
  return (
  <>
  <LeftBarMainMenu username="purple-alien" profilePicture={FavoriteAlien}/>
  <ProfileContent/>
  <RightBarMainMenu motto="Tak trzymaj!" streak="115" level="12"/>
  </>
  );
};

export default ProfilePage;
