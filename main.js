// main.js (diagnosztika)
import React from "react";
import * as ReactDOMClient from "react-dom/client";

// --- Patch: logoljuk MINDEN createRoot hívást ebből a modulpéldányból
if (!globalThis.__PATCHED_CREATE_ROOT__) {
  const origCreateRoot = ReactDOMClient.createRoot;
  ReactDOMClient.createRoot = function patchedCreateRoot(container, options) {
    console.warn("[diag] createRoot() hívás ezen a konténeren:", container);
    console.warn("[diag] container id:", container?.id, "class:", container?.className);
    return origCreateRoot.call(this, container, options);
  };
  globalThis.__PATCHED_CREATE_ROOT__ = true;
}

// --- Oldjuk meg, hogy EGYETLEN alkalommal bootoljunk
if (globalThis.__APP_BOOTED__) {
  console.warn("[main.js] App már bootolt — második indítás BLOKKOLVA.");
} else {
  globalThis.__APP_BOOTED__ = true;
  console.log("[main.js] loaded at", new Date().toISOString());

  // Ha volt korábbi root, próbáljuk kulturáltan leállítani
  try {
    globalThis.__APP_ROOT__?.unmount?.();
    if (globalThis.__APP_ROOT__) console.log("[main.js] Korábbi root unmount-olva.");
  } catch (e) {
    console.warn("[main.js] Unmount figyelmeztetés:", e);
  }

  // Konténer kiválasztása vagy létrehozása
  let container = document.getElementById("root-app") || document.getElementById("root");
  if (!container) {
    // ha véletlen nincs, hozzunk létre egyet
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
    console.warn("[main.js] Nem találtam konténert, létrehoztam: #root");
  }

  // Tiszta, új konténerre váltunk (kerülve a #62-t)
  const fresh = container.cloneNode(false);
  fresh.id = "root-app"; // állandósítjuk ezt az ID-t
  container.replaceWith(fresh);

  // Új root létrehozása
  const root = ReactDOMClient.createRoot(fresh);
  globalThis.__APP_ROOT__ = root;

  // Minimál UI (látványos, hogy tényleg renderel)
  function App() {
    return React.createElement(
      "main",
      { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial;border:2px solid #fff" },
      React.createElement("h1", null, "Suno Generate – diagnosztikai render"),
      React.createElement("p", null, "Ha ezt látod, a render lefutott, a #62-őt második createRoot okozza."),
    );
  }

  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));

  // Extra: listázzuk ki a lapon levő module scripteket
  const mods = [...document.querySelectorAll('script[type="module"]')].map(s => s.outerHTML.slice(0, 140));
  console.log("[diag] module scripts a lapon:", mods);
}
