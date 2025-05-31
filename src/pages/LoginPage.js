import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bacground from "../features/Bacground/Bacground";
import { useDispatch } from "react-redux";
import {
  fetchUserProfile,
  fetchNotifications,
} from "../../src/store/reducer.jsx";
import Loading from "../components/Loading/Loading.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("/User/test", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await dispatch(fetchUserProfile());
          await dispatch(fetchNotifications());
          navigate("/menu");
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch {
        localStorage.removeItem("accessToken");
      }
    };

    checkToken();
  }, [navigate]);

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (username.length < 8) {
      setErrorMessage("Niepoprawne dane logowania.");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Niepoprawne dane logowania.");
      setIsLoading(false);
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
        localStorage.setItem("accessToken", data.accessToken); // Save token
        setErrorMessage("");

        await dispatch(fetchUserProfile());
        await dispatch(fetchNotifications());
        navigate("/menu");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Niepoprawne dane logowania.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem.");
      setIsLoading(false);
    }
  };

  return (
    //<Loading />
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
        {isLoading ? (
          <Loading />
        ) : (
          <>
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

              <button type="submit" className="auth-button">
                Zaloguj się
              </button>
            </form>

            <div className="auth-links">
              <a href="/forgot-password">Zapomniałeś hasła?</a>
              <a href="/register">Zarejestruj się</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
