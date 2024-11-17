import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-container">
      <div className="background-circle circle-small"></div>
      <div className="background-circle circle-big"></div>
      <h1 className="app-title">SpaceMath</h1>
      <div className="auth-box">
        <form onSubmit={handleRegister}>
          <p className="auth-words">Email</p>
          <input type="email" className="auth-input" required />
          <p className="auth-words">Nazwa użytkownika</p>
          <input type="text" className="auth-input" required />
          <p className="auth-words">Hasło</p>
          <input type="password" className="auth-input" required />
          <p className="auth-words">Potwierdź hasło</p>
          <input type="password" className="auth-input" required />
          <button type="submit" className="auth-button">
            Stwórz konto
          </button>
        </form>
        <div className="auth-links">
          <a href="/">Zaloguj się</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
