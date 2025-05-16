import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles/global.css";
import "./styles/main-manu.css" ;
import "./styles/exercise-series.css" ;
import "./components/Borders.css";
import "./styles/system-menu.css";
import "./styles/profile-page.css";
import "./styles/user-profile-popup.css";
import "./styles/theory.css";

import { Provider } from "react-redux";
import store from "./store/store.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
