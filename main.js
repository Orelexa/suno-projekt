// main.js — React 18 alatt is működő, LEGACY renderrel (nem createRoot)
import React from "react";
import ReactDOM from "react-dom";

// Logoljuk, hogy mikor tölt be a modul
console.log("[main.js] legacy start", new Date().toISOString());

// Egyszeri boot védelem
if (globalThis.__APP_BOOTED__) {
  console.warn("[main.js] második boot blokkolva");
} else {
  globalThis.__APP_BOOTED__ = true;

  // Ha bármi korábbi root futott, próbáljuk leállítani (legacy takarítás)
  try { globalThis.__APP_ROOT_UNMOUNT__?.(); } catch {}

  // Új, egyedi konténer
  const containerId = "app-root-legacy";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.minHeight = "100vh";
    document.body.prepend(container);
    console.log("[main.js] létrehozott konténer:", `#${containerId}`);
  }

  // Minimal UI – jól látható visszajelzés
  function App() {
    return React.createElement(
      "main",
      { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
      React.createElement("h1", null, "Suno Generate – legacy render"),
      React.createElement("p", null, "Itt a régi ReactDOM.render-t használjuk, így a createRoot körüli #62 kimarad.")
    );
  }

  // LEGACY RENDER (ReactDOM.render) – nincs createRoot, nincs #62
  ReactDOM.render(
    React.createElement(App),
    container
  );

  // Elmentjük az unmountoló függvényt (ha később kell)
  globalThis.__APP_ROOT_UNMOUNT__ = () => ReactDOM.unmountComponentAtNode(container);
}
