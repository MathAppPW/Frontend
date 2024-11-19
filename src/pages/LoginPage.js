import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-container">
      <div className="background-circle circle-small"></div>
      <div className="background-circle circle-big"></div>
      <h1 className="app-title">SpaceMath</h1>
      <div className="auth-box">
        <form onSubmit={handleLogin}>
          <p className="auth-words">Nazwa użytkownika</p>
          <input
            type="text"
            className="auth-input"
            required
          />
          <p className="auth-words">Hasło</p>
          <input
            type="password"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            Zaloguj się
          </button>
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
