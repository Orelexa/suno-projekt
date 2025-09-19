// main.js
import React from "react";
import { createRoot } from "react-dom/client";

// Logoljuk, hányszor fut le a modul
console.log("[main.js] loaded at", new Date().toISOString());

const container = document.getElementById("root");
if (!container) throw new Error("#root nem található");

// Ha már létezett egy root (pl. valami miatt duplán fut a modul), újrahasznosítjuk
const root = globalThis.__APP_ROOT__ || (globalThis.__APP_ROOT__ = createRoot(container));

function App() {
  return React.createElement(
    "main",
    { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
    React.createElement("h1", null, "Suno Generate – stabil belépő"),
    React.createElement("p", null, "Ha ezt látod, a #62 hiba elhárult (egyszeri render).")
  );
}

root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
