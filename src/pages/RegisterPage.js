import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bacground from "../features/Bacground/Bacground";
import "../styles/log-page.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const response = await fetch(`/User/test`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/menu");
      } else {
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (username.length < 8) {
      setErrorMessage("Nazwa użytkownika musi mieć co najmniej 8 znaków.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Wprowadź poprawny adres e-mail.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage(
        "Hasło musi mieć min. 8 znaków, 1 małą literę, 1 dużą literę, 1 cyfrę i 1 znak specjalny."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Hasła nie są identyczne.");
      return;
    }

    try {
      const response = await fetch(`/User/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setErrorMessage("");
        navigate("/menu");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Błąd rejestracji.");
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem.");
    }
  };

  return (
    <div className="auth-container">
      <Bacground />
      <div className="contour f-right-top"></div>
      <div className="contour f-right-bottom"></div>
      <div className="contour s-right-top"></div>
      <div className="contour s-right-bottom"></div>
      <div className="contour f-left-top"></div>
      <div className="contour f-left-bottom"></div>
      <div className="contour s-left-top"></div>
      <div className="contour s-left-bottom"></div>

      <h1 className="app-title">SpaceMath</h1>
      <div className="auth-box">
        <form onSubmit={handleRegister}>
          <p className="auth-words">Email</p>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="auth-words">Nazwa użytkownika</p>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <p className="auth-words">Hasło</p>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="auth-words">Potwierdź hasło</p>
          <input
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="auth-button">Stwórz konto</button>
        </form>

        <div className="auth-links">
          <a href="/">Zaloguj się</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
