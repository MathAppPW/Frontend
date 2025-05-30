// Initial state remains the same
const initialState = {
  userName: "Nieznany",
  profilePicture: null,
  rocketSkin: null,
  level: 1,
  lives: 5,
  experience: 0,
  streak: 0, // This will be updated ONLY by SET_STREAK
  secondsToHeal: 0,
  lastLivesUpdate: null,
  progress: 0,
  notification: 0,
};

// Action Types
const SET_PROFILE = "SET_PROFILE";
const SET_USERNAME = "SET_USERNAME";
const SET_LIVES = "SET_LIVES";
const SET_EXPERIENCE = "SET_EXPERIENCE";
const SET_STREAK = "SET_STREAK";
const SET_NOTIFICATION = "SET_NOTIFICATION";

// Action Creators
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

export function setStreak(streakValue) {
  return {
    type: SET_STREAK,
    payload: streakValue,
  };
}

export function setNotification(count) {
  return {
    type: SET_NOTIFICATION,
    payload: count,
  };
}

// Thunks
export function fetchUserProfile() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu! (fetchUserProfile)");
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
      console.log("User profile from API (for SET_PROFILE):", data);
      dispatch(setUserProfile(data));
    } catch (error) {
      console.error("Błąd przy pobieraniu profilu:", error);
    }
  };
}

export function fetchLives() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu! (fetchLives)");
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
      console.error("Brak tokenu! (fetchExperience)");
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
      // Corrected line
      console.error("Błąd przy pobieraniu doświadczenia:", error);
    }
  };
}

export function fetchStreakData() {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Brak tokenu! (fetchStreakData)");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Streak/current`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          "Nie udało się pobrać danych o streak:",
          response.status,
          errorBody
        );
        throw new Error(
          `Nie udało się pobrać danych o streak. Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (typeof data.streak !== "undefined") {
        dispatch(setStreak(data.streak));
      } else {
        console.error(
          "Otrzymane dane o streak nie mają oczekiwanego formatu:",
          data
        );
      }
    } catch (error) {
      console.error("Błąd przy pobieraniu danych o streak:", error);
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

// Reducer
const reductor = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        userName:
          action.payload.username !== undefined
            ? action.payload.username
            : state.userName,
        profilePicture:
          action.payload.profileSkin !== undefined
            ? action.payload.profileSkin
            : state.profilePicture,
        rocketSkin:
          action.payload.rocketSkin !== undefined
            ? action.payload.rocketSkin
            : state.rocketSkin,
        level:
          action.payload.level !== undefined
            ? action.payload.level
            : state.level,
        lives:
          action.payload.lives !== undefined
            ? action.payload.lives
            : state.lives,
        experience:
          action.payload.experience !== undefined
            ? action.payload.experience
            : state.experience,
        secondsToHeal:
          action.payload.secondsToHeal !== undefined
            ? action.payload.secondsToHeal
            : state.secondsToHeal,
        lastLivesUpdate:
          action.payload.lastLivesUpdate !== undefined
            ? action.payload.lastLivesUpdate
            : state.lastLivesUpdate,
        progress:
          action.payload.progress !== undefined
            ? action.payload.progress
            : state.progress,
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
    case SET_EXPERIENCE:
      return {
        ...state,
        level: action.payload.level,
        experience: action.payload.experience,
        progress: action.payload.progress,
      };
    case SET_STREAK:
      return {
        ...state,
        streak: action.payload,
      };
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    default:
      return state;
  }
};

export default reductor;
