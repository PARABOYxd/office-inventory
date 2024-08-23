import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import "./index.css"; // Ensure this imports the Tailwind CSS
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
