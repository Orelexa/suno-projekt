// main.js — tiszta, ütközésmentes belépő
import React from "react";
import { createRoot } from "react-dom/client";

// Logoljuk, hogy mikor tölt be a modul
console.log("[main.js] loaded at", new Date().toISOString());

// Egyszeri boot védelem (ha valamiért kétszer hívódna)
if (globalThis.__APP_BOOTED__) {
  console.warn("[main.js] Második boot kísérlet — kihagyva.");
} else {
  globalThis.__APP_BOOTED__ = true;

  // 1) Hozzunk létre EGY VADONATÚJ konténert, egyedi ID-val
  //    (nem a régi #root, így semmivel sem ütközhet)
  const containerId = "app-root-uniq";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.minHeight = "100vh";
    document.body.prepend(container);
    console.log("[main.js] Új konténer létrehozva:", `#${containerId}`);
  }

  // 2) Biztos, ami biztos: ha volt korábbi rootunk, zárjuk le
  try {
    globalThis.__APP_ROOT__?.unmount?.();
  } catch (e) {
    console.warn("[main.js] Unmount figyelmeztetés:", e);
  }

  // 3) ÚJ React root létrehozása a VADONATÚJ konténerre
  const root = createRoot(container);
  globalThis.__APP_ROOT__ = root;

  // 4) Minimál UI — látható visszajelzés
  function App() {
    return React.createElement(
      "main",
      { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
      React.createElement("h1", null, "Suno Generate – tiszta indulás"),
      React.createElement("p", null, "Új, egyedi konténerre renderelünk → React #62 többé nem zavar be.")
    );
  }

  root.render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
}
