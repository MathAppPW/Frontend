const initialState = {
  userName: "Nieznany",
  profilePicture: null,
  rocketSkin: null,
  level: 1,
  lives: 5,
  experience: 0,
  streak: 0,
  secondsToHeal: 0,
  lastLivesUpdate: null,
  progress: 0,
  notification: 0,
};

const SET_PROFILE = "SET_PROFILE";
const SET_USERNAME = "SET_USERNAME";
const SET_LIVES = "SET_LIVES";
const SET_EXPERIENCE = "SET_EXPERIENCE";
const SET_NOTIFICATION = "SET_NOTIFICATION";

// akcja
export function setUserProfile(profileData) {
  return {
    type: SET_PROFILE,
    payload: profileData,
  };
}
export function setUserName(userName) {
  return {
    type: SET_USERNAME,
    payload: userName,
  };
}

export function setLives(lives, secondsToHeal) {
  return {
    type: SET_LIVES,
    payload: {
      lives,
      secondsToHeal,
    },
  };
}

export function setExperience(level, experience, progress) {
  return {
    type: SET_EXPERIENCE,
    payload: {
      level,
      experience,
      progress,
    },
  };
}

export function setNotification(count) {
  return {
    type: SET_NOTIFICATION,
    payload: count,
  };
}

// thunk – pobiera dane z API i wywołuje akcję
export function fetchUserProfile() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu!");
      return;
    }

    try {
      const response = await fetch(`/UserProfile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych profilu");
      }

      const data = await response.json();
      console.log("User profile from API:", data);

      dispatch(setUserProfile(data));
    } catch (error) {
      console.error("Błąd przy pobieraniu profilu:", error);
    }
  };
}

// Thunk: fetch lives from API
export function fetchLives() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Lives`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych o życiach");
      }

      const data = await response.json();
      dispatch(setLives(data.lives, data.secondsToHeal));
    } catch (error) {
      console.error("Błąd przy pobieraniu żyć:", error);
    }
  };
}

export function fetchExperience() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/experience", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych o doświadczeniu");
      }

      const data = await response.json();
      dispatch(setExperience(data.level, data.experience, data.progress));
    } catch (error) {
      console.error("Błąd przy pobieraniu doświadczenia:", error);
    }
  };
}

export function fetchNotifications() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu!");
      return;
    }

    try {
      const response = await fetch(`/Friends/getPendingRequests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać powiadomień");
      }

      const data = await response.json();
      const count = data.length;
      dispatch(setNotification(count));
    } catch (error) {
      console.error("Błąd przy pobieraniu powiadomień:", error);
    }
  };
}

// reducer
const reductor = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        userName: action.payload.username,
        profilePicture: action.payload.profileSkin,
        rocketSkin: action.payload.rocketSkin,
        level: action.payload.level,
        lives: action.payload.lives,
        experience: action.payload.experience,
        streak: action.payload.streak,
        secondsToHeal: action.payload.secondsToHeal,
        lastLivesUpdate: action.payload.lastLivesUpdate,
      };
    case SET_USERNAME:
      return {
        ...state,
        userName: action.payload,
      };
    case SET_LIVES:
      return {
        ...state,
        lives: action.payload.lives,
        secondsToHeal: action.payload.secondsToHeal,
      };
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    case SET_EXPERIENCE:
      return {
        ...state,
        level: action.payload.level,
        experience: action.payload.experience,
        progress: action.payload.progress,
      };
    default:
      return state;
  }
};

export default reductor;
