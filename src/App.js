import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainMenuPage from "./pages/MainMenuPage";
import LostPassword from "./pages/LostPassword";
import SystemMenuPage from "./pages/SystemMenuPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/system" element={<SystemMenuPage />} />
        <Route path="/forgot-password" element={<LostPassword />}/>
      </Routes>
    </Router>
  );
};

export default App;
