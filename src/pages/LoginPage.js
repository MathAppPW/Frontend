import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-page">
      <h1>Logowanie</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Hasło" required />
        <button type="submit">Zaloguj</button>
      </form>
      <p>
        Nie masz konta? <a href="/register">Rejestracja</a>
      </p>
    </div>
  );
};

export default LoginPage;
