import React, { useState, useEffect } from "react";
import TaskChart from "./charts/TaskChart";
import TimeChart from "./charts/TimeChart";
import EditPopup from "./popups/EditPopup";
import ConfirmDeletePopup from "./popups/ConfirmDeletePopup";
import ChangeFieldPopup from "./popups/ChangeFieldPopup";
import AvatarPopup from "./popups/AvatarPopup";
import ShipPopup from "./popups/ShipPopup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUserProfile, setUserName } from "../../store/reducer";
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

// Generacjo losowych danych do testów
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
  const [isNameChangeOpen, setNameChangeOpen] = useState(false);
  const [isEmailChangeOpen, setEmailChangeOpen] = useState(false);
  const [isPasswordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const [pendingChanges, setPendingChanges] = useState({
    newUsername: null,
    newEmail: null,
    newPassword: null,
  });  
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

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });
  
  useEffect(() => {
    axios.get("/Streak/longest", getAuthHeader())
      .then(res => setBestStreak(res.data.streak))
      .catch(err => console.error("Błąd pobierania streaka:", err));
  }, []);  

  useEffect(() => {
    axios.get("/History/days", getAuthHeader())
      .then(res => {
        const data = res.data.days;
        //const data = generateTestData();
        setAllData(data);
        const totalSecs = data.reduce((sum, d) => sum + d.secondsSpent, 0);
        const totalEx = data.reduce((sum, d) => sum + d.exercisesCount, 0);
        setTotalExercises(totalEx);
        setTotalHours(Math.round((totalSecs / 3600) * 10) / 10);
      })
      .catch(err => console.error("Błąd pobierania statystyk:", err));
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
      axios.get("/ProfileSkin", getAuthHeader())
        .then(res => setSelectedAvatarId(res.data.skinId))
        .catch(err => console.error("Błąd pobierania awatara:", err));
    }
  }, [isAvatarOpen, selectedAvatarId]);

  useEffect(() => {
    if (isShipOpen && selectedShipId === null) {
      axios.get("/RocketSkin", getAuthHeader())
        .then(res => setSelectedShipId(res.data.skinId))
        .catch(err => console.error("Błąd pobierania rakiety:", err));
    }
  }, [isShipOpen, selectedShipId]);

  useEffect(() => {
    axios.get("/User/email", getAuthHeader())
      .then(res => setUserData(res.data))
      .catch(err => console.error("Błąd pobierania danych użytkownika:", err));
  }, []);  

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

  const handleApplyChanges = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  
    try {
      if (pendingChanges.newUsername && pendingChanges.newUsername !== userData.username) {
        await axios.put("/User/updateUsername", { newUsername: pendingChanges.newUsername }, { headers });
        setUserData(prev => ({ ...prev, username: pendingChanges.newUsername }));
        dispatch(setUserName(pendingChanges.newUsername));
      }
  
      if (pendingChanges.newEmail && pendingChanges.newEmail !== userData.email) {
        await axios.put("/User/updateMail", { newMail: pendingChanges.newEmail }, { headers });
        setUserData(prev => ({ ...prev, email: pendingChanges.newEmail }));
      }
  
      if (pendingChanges.newPassword) {
        await axios.put("/User/updatePassword", pendingChanges.newPassword, { headers });
      }
  
      dispatch(fetchUserProfile());
      setEditOpen(false);
      setPendingChanges({ newUsername: null, newEmail: null, newPassword: null });
      setErrorMessage("");
    } catch (err) {
      console.error("Błąd przy zapisie zmian:", err);
      setErrorMessage("Podane zmiany są niepoprawne lub zajęte przez innego użytkownika!");
    }
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
        <TaskChart
          data={tasksData}
          range={tasksFilterRange}
          onFilterChange={setTasksFilterRange}
          formatLabel={formatLabel}
        />
        <TimeChart
          data={timeData}
          range={timeFilterRange}
          onFilterChange={setTimeFilterRange}
          formatLabel={formatLabel}
        />
      </div>

      {isEditOpen && (
        <EditPopup
          username={userData.username}
          email={userData.email}
          onClose={() => {
            setEditOpen(false);
            setErrorMessage("");
            setPendingChanges({ newUsername: null, newEmail: null, newPassword: null });
          }}
          onNameEdit={() => setNameChangeOpen(true)}
          onEmailEdit={() => setEmailChangeOpen(true)}
          onPasswordEdit={() => setPasswordChangeOpen(true)}
          onDeleteConfirm={() => setDeleteConfirmOpen(true)}
          onSave={handleApplyChanges}
          pendingChanges={pendingChanges}
          errorMessage={errorMessage}
        />
      )}

      {isDeleteConfirmOpen && (
        <ConfirmDeletePopup onClose={() => setDeleteConfirmOpen(false)} />
      )}

      {isNameChangeOpen && (
        <ChangeFieldPopup
          title="Zmiana nazwy użytkownika"
          label="Nazwa użytkownika"
          onSave={(value) => {
            setPendingChanges(prev => ({ ...prev, newUsername: value }));
            setEmailChangeOpen(false);
          }}
          onClose={() => setNameChangeOpen(false)}
        />
      )}

      {isEmailChangeOpen && (
        <ChangeFieldPopup
          title="Zmiana adresu e-mail"
          label="Adres e-mail"
          onSave={(value) => {
            setPendingChanges(prev => ({ ...prev, newEmail: value }));
            setEmailChangeOpen(false);
          }}
          onClose={() => setEmailChangeOpen(false)}
        />
      )}

      {isPasswordChangeOpen && (
        <ChangeFieldPopup
          title="Zmiana hasła"
          label="Nowe hasło"
          isPassword
          onSave={(value) => {
            setPendingChanges(prev => ({ ...prev, newPassword: value }));
            setPasswordChangeOpen(false);
          }}          
          onClose={() => setPasswordChangeOpen(false)}
        />
      )}

      {isAvatarOpen && (
        <AvatarPopup
          avatars={avatars}
          avatarNames={avatarNames}
          selectedAvatarId={selectedAvatarId}
          setSelectedAvatarId={setSelectedAvatarId}
          onSave={saveAvatar}
          onClose={() => setAvatarOpen(false)}
        />
      )}

      {isShipOpen && (
        <ShipPopup
          ships={ships}
          shipNames={shipNames}
          selectedShipId={selectedShipId}
          setSelectedShipId={setSelectedShipId}
          onSave={saveShip}
          onClose={() => setShipOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileContent;
