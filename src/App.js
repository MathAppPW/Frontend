import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainMenuPage from "./pages/MainMenuPage";
import LostPassword from "./pages/LostPassword";
import SystemMenuPage from "./pages/SystemMenuPage";
import ExerciseSeries from "./pages/ExerciseSeries";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch } from "react-redux";
import { fetchUserProfile, setUserName } from "./store/reducer.jsx";
import { useEffect } from "react";
import Friends from "./pages/Friends.jsx";
import Rank from "./pages/Rank.jsx";


const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
   
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/system" element={<SystemMenuPage />} />
        <Route path="/forgot-password" element={<LostPassword />}/>
        <Route path="/task" element={<ExerciseSeries/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/friends" element={<Friends/>}/>
        <Route path ="/ranking" element={<Rank/>}/>
      </Routes>
    </Router>
  );
};

export default App;
