import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HealthProvider } from "./state/HealthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HealthProvider>
        <App />
      </HealthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
