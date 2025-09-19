// main.js
import React from "react";
import { createRoot } from "react-dom/client";

// ====== BOOT GUARD: csak egyszer induljunk el ======
if (globalThis.__APP_BOOTED__) {
  console.warn("[main.js] App már bootolt — második indítás blokkolva.");
} else {
  globalThis.__APP_BOOTED__ = true;
  console.log("[main.js] loaded at", new Date().toISOString());

  // ====== Ha volt korábbi root, előbb tisztán lezárjuk ======
  if (globalThis.__APP_ROOT__ && typeof globalThis.__APP_ROOT__.unmount === "function") {
    try {
      globalThis.__APP_ROOT__.unmount();
      console.log("[main.js] Korábbi React root unmount-olva.");
    } catch (e) {
      console.warn("[main.js] Unmount figyelmeztetés:", e);
    }
  }

  // ====== Mindig FRISS, ÚJ konténer ======
  const oldContainer =
    document.getElementById("root-app") ||
    document.getElementById("root");

  if (!oldContainer) {
    throw new Error("#root vagy #root-app nem található a DOM-ban.");
  }

  const fresh = document.createElement("div");
  fresh.id = "root-app"; // állandó ID az új indulásokhoz
  oldContainer.replaceWith(fresh);

  // ====== ÚJ root létrehozása (nincs duplikáció) ======
  const root = createRoot(fresh);
  globalThis.__APP_ROOT__ = root;

  // ====== Minimál UI – látható visszajelzés ======
  function App() {
    return React.createElement(
      "main",
      { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
      React.createElement("h1", null, "Suno Generate – stabil belépő"),
      React.createElement(
        "p",
        null,
        "A React #62 ütközést elkerültük: unmount + új konténer + egyszeri boot."
      )
    );
  }

  root.render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
}
