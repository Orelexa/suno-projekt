// main.js
import React from "react";
import { createRoot } from "react-dom/client";

// Logoljuk, hányszor fut le a modul
console.log("[main.js] loaded at", new Date().toISOString());

/**
 * Ellenőrzi, hogy a #root elemre már hívta-e valaki a createRoot-ot.
 * Ha igen, létrehozunk egy ÚJ, tiszta konténert és kicseréljük a DOM-ban,
 * így biztosan nem kapunk React #62 hibát.
 */
function ensureFreshContainer() {
  let container = document.getElementById("root");
  if (!container) throw new Error("#root nem található");

  // React 18 belső jelölése: a konténeren megjelenik egy __reactContainer$... kulcs
  const hasReactMarker = Object.getOwnPropertyNames(container)
    .some((k) => k.startsWith("__reactContainer$"));

  if (hasReactMarker) {
    console.warn("[main.js] Létező React root észlelve a #root-on – új konténer készül.");
    const fresh = container.cloneNode(false); // üres klón
    fresh.id = "root-app"; // új ID, hogy biztosan tiszta legyen
    container.replaceWith(fresh);
    return fresh;
  }

  return container;
}

const container = ensureFreshContainer();

// Egyetlen root példányt hozunk létre
const root = createRoot(container);

// Minimál kezdő UI – hogy legyen látható visszajelzés
function App() {
  return React.createElement(
    "main",
    { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
    React.createElement("h1", null, "Suno Generate – stabil belépő"),
    React.createElement("p", null, "A React #62 ütközést elkerültük új konténerrel.")
  );
}

root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
