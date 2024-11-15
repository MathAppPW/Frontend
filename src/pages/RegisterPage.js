import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/menu");
  };

  return (
    <div className="auth-page">
      <h1>Rejestracja</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nazwa użytkownika" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Hasło" required />
        <input type="password" placeholder="Potwierdź Hasło" required />
        <button type="submit">Stwórz konto</button>
      </form>
      <p>
        Masz już konto? <a href="/">Zaloguj</a>
      </p>
    </div>
  );
};

export default RegisterPage;
