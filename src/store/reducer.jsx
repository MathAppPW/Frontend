const initialState = {
  userName: 'Kornelia',         
  rocketSkin: 0,
  level: 1,
  lives: 5,
  experience: 0,
  streak: 0,
  secondsToHeal: 0,
  lastLivesUpdate: null,
};

const SET_PROFILE = "SET_PROFILE";
const SET_USERNAME = "SET_USERNAME";

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

// reducer
const reductor = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
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
    default:
      return state;
  }
};

export default reductor;
