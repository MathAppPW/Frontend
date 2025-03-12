import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainMenuPage from "./pages/MainMenuPage";
import LostPassword from "./pages/LostPassword";
import SystemMenuPage from "./pages/SystemMenuPage";
import ExerciseSeries from "./pages/ExerciseSeries";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/system" element={<SystemMenuPage />} />
        <Route path="/forgot-password" element={<LostPassword />}/>
        <Route path="/task" element={<ExerciseSeries/>}/>
      </Routes>
    </Router>
  );
};

export default App;
