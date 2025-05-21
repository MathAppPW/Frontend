import fire from "../../assets/images/Fire.png";
import rocket0 from "../../assets/images/RocketsImages/0.png";
import rocket1 from "../../assets/images/RocketsImages/1.png";
import rocket2 from "../../assets/images/RocketsImages/2.png";
import rocket3 from "../../assets/images/RocketsImages/3.png";
import rocket4 from "../../assets/images/RocketsImages/4.png";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  setLives,
  fetchExperience,
  fetchStreakData,
} from "../../store/reducer";

import MiniCalendar from "../../components/MiniCalenadar/MiniCalendar";

function RightBarMainMenu(props) {
  const lives = useSelector((state) => state.lives);
  const ship = useSelector((state) => state.rocketSkin);
  const streak = useSelector((state) => state.streak);
  const secondsToHealRedux = useSelector((state) => state.secondsToHeal);

  const level = useSelector((state) => state.level);
  const progress = useSelector((state) => state.progress);

  const dispatch = useDispatch();

  const [secondsToHeal, setSecondsToHeal] = useState(secondsToHealRedux || 0);

  const token = localStorage.getItem("accessToken");

  const rocketImages = {
    0: rocket0,
    1: rocket1,
    2: rocket2,
    3: rocket3,
    4: rocket4,
  };

  // 1) Fetch Lives from server (local function)
  const fetchLives = async () => {
    if (!token) {
      console.error("Brak tokenu (RightBarMainMenu fetchLives)");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/Lives", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Update Redux with the specific action creator
      dispatch(setLives(data.lives, data.secondsToHeal));
      // Update local countdown
      setSecondsToHeal(data.secondsToHeal);
    } catch (error) {
      console.error("Błąd podczas pobierania żyć:", error);
    }
  };

  // Initial data fetching useEffect
  useEffect(() => {
    fetchLives(); // Calls the local fetchLives function
    dispatch(fetchExperience()); // Dispatches the thunk for experience
    dispatch(fetchStreakData()); // Dispatches the thunk for streak data
  }, []);


  // If Redux changes the global countdown externally, sync local
  useEffect(() => {
    setSecondsToHeal(secondsToHealRedux);
  }, [secondsToHealRedux]);

  // Timer logic for auto-healing
  useEffect(() => {
    if (lives >= 5 || secondsToHeal <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsToHeal((prevTime) => {
        if (prevTime <= 1) {
          const newLives = Math.min(lives + 1, 5);
          const newHealTime = newLives < 5 ? 300 : 0;

          // Update Redux store
          dispatch(setLives(newLives, newHealTime));
          return newHealTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lives, secondsToHeal, dispatch]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="bar-main-menu right-bar-main-menu">
        <div className="streak-main-menu-cointener">
          <p>{props.motto}</p>
          <div className="streak-main-menu">
            <p>{streak}</p> {/* Streak value from Redux store */}
            <img src={fire} className="fire" alt="fire" />
          </div>
        </div>

        <div className="spaceship-main-menu-container">
          <img className="space-ship" src={rocketImages[ship]} alt="rocket" />

          <div className="life">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`material-icons ${
                  i < lives ? "icon-heart-full" : "icon-heart-empty"
                }`}
              >
                {i < lives ? "favorite" : "favorite_border"}
              </span>
            ))}
            {lives < 5 && secondsToHeal > 0 && (
              <div className="heal-timer">
                <p>Nowe życie za: {formatTime(secondsToHeal)}</p>
              </div>
            )}
          </div>

          <div className="progress-container">
            <p className="progress-number">{level}</p>
            <div className="progress-bar">
              <div
                className="progress-filled"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <MiniCalendar />
      </div>

      <div className="borrder-menu left-borrder-menu-top"></div>
      <div className="borrder-menu left-borrder-menu-bottom"></div>
    </>
  );
}

export default RightBarMainMenu;
