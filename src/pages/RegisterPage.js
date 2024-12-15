import React from "react";
import { useNavigate } from "react-router-dom";
import Bacground from "../features/Bacground/Bacground";
import "../styles/log-page.css"



const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    
    <div className="auth-container">
      <Bacground/>
      <div class="contour f-right-top"></div>
      <div class="contour f-right-bottom"></div>
      <div class="contour s-right-top"></div>
      <div class="contour s-right-bottom"></div>
      <div class="contour f-left-top"></div>
      <div class="contour f-left-bottom"></div>
      <div class="contour s-left-top"></div>
      <div class="contour s-left-bottom"></div>
      
      <h1 className="app-title">SpaceMath</h1>
      <div className="auth-box">
        <form onSubmit={handleRegister}>
          <p className="auth-words">Email</p>
          <input
            type="email"
            className="auth-input"
            required
          />
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
          <p className="auth-words">Potwierdź hasło</p>
          <input
            type="password"
            className="auth-input"
            required
          />
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
