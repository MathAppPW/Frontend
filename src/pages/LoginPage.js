import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bacground from "../features/Bacground/Bacground";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.length < 8) {
      setErrorMessage("Nazwa użytkownika musi mieć co najmniej 8 znaków.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage(
        "Hasło musi mieć min. 8 znaków, 1 małą literę, 1 dużą literę, 1 cyfrę i 1 znak specjalny."
      );
      return;
    }

    try {
      const response = await fetch(`/User/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        console.log("Access Token:", data.accessToken);
        setErrorMessage("");
        navigate("/menu");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Błąd logowania.");
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
        <form onSubmit={handleLogin}>
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="auth-button">Zaloguj się</button>
        </form>

        <div className="auth-links">
          <a href="/forgot-password">Zapomniałeś hasła?</a>
          <a href="/register">Zarejestruj się</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
