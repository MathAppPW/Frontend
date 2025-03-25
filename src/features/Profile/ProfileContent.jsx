import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../store/reducer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const generateTestData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const exercises = Math.floor(Math.random() * 10);
    const successful = Math.floor(Math.random() * (exercises + 1));
    const failed = exercises - successful;
    const secondsSpent = exercises === 0 ? 0 : Math.floor(Math.random() * 1800) + 300;
    data.push({
      date: d.toISOString(),
      secondsSpent,
      exercisesCount: exercises,
      exercisesCountSuccessful: successful,
      exercisesCountFailed: failed
    });
  }
  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const groupByWeek = (data) => {
  const groups = {};
  data.forEach(d => {
    const date = new Date(d.date);
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(date);
    monday.setDate(diff);
    const key = monday.toISOString().substring(0, 10);
    if (!groups[key]) {
      groups[key] = {
        secondsSpent: 0,
        exercisesCountSuccessful: 0,
        exercisesCountFailed: 0,
        exercisesCount: 0,
        date: key
      };
    }
    groups[key].secondsSpent += d.secondsSpent;
    groups[key].exercisesCountSuccessful += d.exercisesCountSuccessful;
    groups[key].exercisesCountFailed += d.exercisesCountFailed;
    groups[key].exercisesCount += d.exercisesCount;
  });
  return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const getAggregatedData = (range, data) => {
  const now = new Date();
  let filtered = [];
  if (range === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 6);
    filtered = data.filter(d => new Date(d.date) >= start);
    return filtered;
  } else if (range === "8weeks") {
    const start = new Date();
    start.setDate(now.getDate() - 7 * 8 + 1);
    filtered = data.filter(d => new Date(d.date) >= start);
    return groupByWeek(filtered);
  } else if (range === "month") {
    const start = new Date();
    start.setFullYear(now.getFullYear() - 1);
    filtered = data.filter(d => new Date(d.date) >= start);
  
    const grouped = {};
    filtered.forEach(d => {
      const date = new Date(d.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const paddedMonth = month < 10 ? "0" + month : month;
      const key = `${year}-${paddedMonth}`; 
      if (!grouped[key]) {
        grouped[key] = {
          secondsSpent: 0,
          exercisesCountSuccessful: 0,
          exercisesCountFailed: 0,
          exercisesCount: 0,
          // Poprawny format ISO z zerowym wypełnieniem
          date: `${year}-${paddedMonth}-01T00:00:00Z`
        };
      }
      grouped[key].secondsSpent += d.secondsSpent;
      grouped[key].exercisesCountSuccessful += d.exercisesCountSuccessful;
      grouped[key].exercisesCountFailed += d.exercisesCountFailed;
      grouped[key].exercisesCount += d.exercisesCount;
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  return [];
};

const formatLabelFor = (range, isoDate) => {
  const d = new Date(isoDate);
  if (range === "month") {
    return d.toLocaleDateString("pl-PL", { month: "short", year: "numeric" });
  }
  if (range === "8weeks") {
    return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
  }
  return d.toLocaleDateString("pl-PL", { weekday: "short" });
};

const ProfileContent = () => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAvatarOpen, setAvatarOpen] = useState(false);
  const [isShipOpen, setShipOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [selectedShipId, setSelectedShipId] = useState(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [allData, setAllData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [tasksFilterRange, setTasksFilterRange] = useState("week");
  const [timeFilterRange, setTimeFilterRange] = useState("week");
  
  const dispatch = useDispatch();

  const importAll = (context) => {
    let images = {};
    context.keys().forEach((item) => {
      const name = item.replace("./", "").replace(".png", "");
      images[name] = context(item);
    });
    return images;
  };

  const allAvatars = importAll(require.context("../../assets/images/ProfileImages", false, /\.png$/));
  const avatarOrder = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const avatarNames = ["Noob", "Noob", "Poziom 10", "Poziom 40", "2 Przyjaciół", "50 Zadań", "400 Zadań", "Streak 100", "Streak 500", "Top 3"];
  const avatars = avatarOrder.reduce((ordered, id) => {
    if (allAvatars[id]) ordered[id] = allAvatars[id];
    return ordered;
  }, {});

  const allShips = importAll(require.context("../../assets/images/RocketsImages", false, /\.png$/));
  const shipOrder = ["0", "1", "2", "3", "4"];
  const shipNames = ["Noob", "Poziom 30", "4 Przyjaciół", "200 Zadań", "Streak 300"];
  const ships = shipOrder.reduce((ordered, id) => {
    if (allShips[id]) ordered[id] = allShips[id];
    return ordered;
  }, {});

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  };

  useEffect(() => {
    axios.get("/Streak/longest", authHeader)
      .then(res => setBestStreak(res.data.streak))
      .catch(err => console.error("Błąd pobierania streaka:", err));
  }, []);

  useEffect(() => {
    const testData = generateTestData();
    setAllData(testData);
    const totalSecs = testData.reduce((sum, d) => sum + d.secondsSpent, 0);
    const totalEx = testData.reduce((sum, d) => sum + d.exercisesCount, 0);
    setTotalExercises(totalEx);
    setTotalHours(Math.round((totalSecs / 3600) * 10) / 10);
  }, []);

  useEffect(() => {
    const data = getAggregatedData(tasksFilterRange, allData);
    setTasksData(data);
  }, [tasksFilterRange, allData]);

  useEffect(() => {
    const data = getAggregatedData(timeFilterRange, allData);
    setTimeData(data);
  }, [timeFilterRange, allData]);

  useEffect(() => {
    if (isAvatarOpen && selectedAvatarId === null) {
      axios.get("/ProfileSkin", authHeader)
        .then(res => setSelectedAvatarId(res.data.skinId))
        .catch(err => console.error("Błąd pobierania awatara:", err));
    }
  }, [isAvatarOpen, selectedAvatarId]);

  useEffect(() => {
    if (isShipOpen && selectedShipId === null) {
      axios.get("/RocketSkin", authHeader)
        .then(res => setSelectedShipId(res.data.skinId))
        .catch(err => console.error("Błąd pobierania rakiety:", err));
    }
  }, [isShipOpen, selectedShipId]);

  const saveAvatar = () => {
    axios.post("/ProfileSkin", { skinId: selectedAvatarId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        setAvatarOpen(false);
        setSelectedAvatarId(null);
        dispatch(fetchUserProfile());
      })
      .catch(err => console.error("Błąd zapisu awatara:", err));
  };
  
  const saveShip = () => {
    axios.post("/RocketSkin", { skinId: selectedShipId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        setShipOpen(false);
        setSelectedShipId(null);
        dispatch(fetchUserProfile());
      })
      .catch(err => console.error("Błąd zapisu rakiety:", err));
  };

  const formatLabel = (range, isoDate) => {
    return formatLabelFor(range, isoDate);
  };

  return (
    <div className="profile-content">
      <div className="profile-container">
        <div className="profile-left">
          <button className="profile-button" onClick={() => setEditOpen(true)}>Edytuj dane konta</button>
          <button className="profile-button" onClick={() => setAvatarOpen(true)}>Zmień awatar</button>
          <button className="profile-button" onClick={() => setShipOpen(true)}>Zmień statek</button>
        </div>
        <div className="profile-right">
          <div className="profile-stats">
            <p><strong>Zrobione zadania:</strong> {totalExercises}</p>
            <p><strong>Najlepszy streak:</strong> {bestStreak}</p>
            <p><strong>Czas:</strong> {totalHours}h</p>
          </div>
        </div>
      </div>

      <div className="profile-charts">
        <div className="charts-column" style={{ position: "relative", flexGrow: 1 }}>
          <div className="chart-box">
            <Bar
              data={{
                labels: tasksData.map(d => formatLabel(tasksFilterRange, d.date)),
                datasets: [
                  {
                    label: "Złe",
                    data: tasksData.map(d => d.exercisesCountFailed),
                    backgroundColor: "#FF4C8B",
                    stack: 'zadania',
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 5
                  },
                  {
                    label: "Dobre",
                    data: tasksData.map(d => d.exercisesCountSuccessful),
                    backgroundColor: "#2BF8D6",
                    stack: 'zadania',
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 5
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "white" },
                    reverse: true
                  },
                  title: {
                    display: true,
                    text: "Liczba zrobionych zadań",
                    color: "white",
                    font: { size: 16 },
                    padding: { top: 15 }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                    ticks: { color: "white", maxRotation: 45, minRotation: 45 },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                  }
                }
              }}
            />
          </div>
          <div className="chart-filter" style={{ position: "absolute", right: "10px", top: "10px" }}>
            <select
              value={tasksFilterRange}
              onChange={(e) => setTasksFilterRange(e.target.value)}
              className="task-filter"
            >
              <option value="week">Ostatni tydzień</option>
              <option value="8weeks">Ostatnie 8 tygodni</option>
              <option value="month">Ostatnie 12 miesięcy</option>
            </select>
          </div>
        </div>

        <div className="charts-column" style={{ position: "relative", flexGrow: 1 }}>
          <div className="chart-box">
            <Bar
              data={{
                labels: timeData.map(d => formatLabel(timeFilterRange, d.date)),
                datasets: [
                  {
                    label: "Czas w minutach",
                    data: timeData.map(d => Math.round(d.secondsSpent / 60)),
                    backgroundColor: "#AD15FF",
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 5
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "white" }
                  },
                  title: {
                    display: true,
                    text: "Czas poświęcony na zadania",
                    color: "white",
                    font: { size: 16 },
                    padding: { top: 15 }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: { color: "white", maxRotation: 45, minRotation: 45 },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" }
                  }
                }
              }}
            />
          </div>
          <div className="chart-filter" style={{ position: "absolute", right: "10px", top: "10px" }}>
            <select
              value={timeFilterRange}
              onChange={(e) => setTimeFilterRange(e.target.value)}
              className="task-filter"
            >
              <option value="week">Ostatni tydzień</option>
              <option value="8weeks">Ostatnie 8 tygodni</option>
              <option value="month">Ostatnie 12 miesięcy</option>
            </select>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <Popup title="Edycja konta" onClose={() => setEditOpen(false)}>
          <div className="edit-popup">
            <div className="edit-field">
              <span className="edit-label">Nazwa użytkownika:</span>
              <button className="edit-button">Edytuj</button>
            </div>
            <div className="edit-field">
              <span className="edit-label">Adres e-mail:</span>
              <button className="edit-button">Edytuj</button>
            </div>
            <div className="edit-field">
              <span className="edit-label">Hasło:</span>
              <button className="edit-button">Edytuj</button>
            </div>
            <div className="save-buttons">
              <button className="profile-save-button">Zapisz zmiany</button>
              <button className="profile-save-button" onClick={() => setEditOpen(false)}>Cofnij</button>
            </div>
            <div className="delete-section">
              <h2>Usunięcie konta</h2>
              <p>Usuwasz konto na własną odpowiedzialność, stracisz cały postęp.</p>
              <button className="delete-button" onClick={() => setDeleteConfirmOpen(true)}>Usuń konto</button>
            </div>
          </div>
        </Popup>
      )}

      {isDeleteConfirmOpen && (
        <Popup title="Czy usunąć?" onClose={() => setDeleteConfirmOpen(false)}>
          <div className="confirmation-popup">
            <div className="confirmation-buttons">
              <button className="profile-change-button" onClick={() => setDeleteConfirmOpen(false)}>NIE</button>
            </div>
            <p>By usunąć konto wpisz <strong>swoje hasło</strong>, a następnie kliknij przycisk poniżej.</p>
            <input type="text" className="confirm-input" />
            <button className="delete-button">Usuń konto</button>
          </div>
        </Popup>
      )}

      {isAvatarOpen && (
        <Popup title="Zmiana awatara" onClose={() => setAvatarOpen(false)}>
          <div className="avatar-container">
            {Object.entries(avatars).map(([key, src], i) => (
              <div key={key} className="avatar-box" onClick={() => setSelectedAvatarId(Number(key))}>
                <img src={src} alt={avatarNames[i]} className="avatar-image" />
                <span className={`avatar-name ${selectedAvatarId === Number(key) ? "selected" : ""}`}>
                  {avatarNames[i]}
                </span>
              </div>
            ))}
          </div>
          <button className="profile-save-button" onClick={saveAvatar}>Zapisz zmiany</button>
        </Popup>
      )}

      {isShipOpen && (
        <Popup title="Zmiana statku" onClose={() => setShipOpen(false)}>
          <div className="ship-container">
            {Object.entries(ships).map(([key, src], i) => (
              <div key={key} className="ship-box" onClick={() => setSelectedShipId(Number(key))}>
                <img src={src} alt={shipNames[i]} className="ship-image" />
                <span className={`ship-name ${selectedShipId === Number(key) ? "selected" : ""}`}>
                  {shipNames[i]}
                </span>
              </div>
            ))}
          </div>
          <button className="profile-save-button" onClick={saveShip}>Zapisz zmiany</button>
        </Popup>
      )}
    </div>
  );
};

export default ProfileContent;
