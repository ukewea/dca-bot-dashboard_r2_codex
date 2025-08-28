import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);

