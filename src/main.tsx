import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./assets/styles/Theme.css";
import "./assets/styles/WeatherThemes.css";
import "./assets/styles/Animations.css";
import "./assets/styles/Backgrounds.css";
import "./assets/styles/NavigationRail.css";
import "./assets/styles/WeatherDisplay.css";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
