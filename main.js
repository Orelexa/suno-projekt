// main.js
import React from "react";
import { createRoot } from "react-dom/client";

// Log: hányadszor tölt be a modul
console.log("[main.js] loaded at", new Date().toISOString());

const container = document.getElementById("root");
if (!container) throw new Error("#root nem található");

// Ütközésvédelem: ha már van root, ne hozzuk létre újra (React #62 elleni védelem)
const root = globalThis.__APP_ROOT__ || (globalThis.__APP_ROOT__ = createRoot(container));

// Minimál kezdő UI – csak hogy lásd, hogy él
function App() {
  return React.createElement(
    "main",
    { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
    React.createElement("h1", null, "Suno Generate – 1. lépés OK"),
    React.createElement("p", null, "Egyetlen belépő modul fut, nincs React #62.")
  );
}

root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
