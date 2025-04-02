import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile, setUserName } from "./store/reducer.jsx";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainMenuPage from "./pages/MainMenuPage";
import LostPassword from "./pages/LostPassword";
import SystemMenuPage from "./pages/SystemMenuPage";
import ExerciseSeries from "./pages/ExerciseSeries";
import ProfilePage from "./pages/ProfilePage";
import Friends from "./pages/Friends.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<LostPassword />} />
        

        {/* Protected Routes */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system"
          element={
            <ProtectedRoute>
              <SystemMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <ExerciseSeries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
