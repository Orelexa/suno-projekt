// main.js — vészbiztos indítás: minden más module script eltávolítva
import React from "react";
import { createRoot } from "react-dom/client";

console.log("[main.js] start", new Date().toISOString());

// 1) Szedd ki az összes többi module scriptet, csak a saját maradjon
for (const s of [...document.querySelectorAll('script[type="module"]')]) {
  if (!(s.src || "").endsWith("/main.js")) {
    console.warn("[main.js] másik module script eltávolítva:", s.src || "(inline)");
    s.remove();
  }
}

// 2) Ha volt régi root, állítsuk le
try { globalThis.__APP_ROOT__?.unmount?.(); } catch {}

// 3) Egyedi konténer létrehozása (nem a régi #root)
const containerId = "app-root-uniq";
let container = document.getElementById(containerId);
if (!container) {
  container = document.createElement("div");
  container.id = containerId;
  container.style.minHeight = "100vh";
  document.body.prepend(container);
}

// 4) Egyszeri boot védelem
if (globalThis.__APP_BOOTED__) {
  console.warn("[main.js] második boot blokkolva");
} else {
  globalThis.__APP_BOOTED__ = true;

  const root = createRoot(container);
  globalThis.__APP_ROOT__ = root;

  function App() {
    return React.createElement(
      "main",
      { style: "padding:24px;color:#fff;font-family:system-ui,Segoe UI,Arial" },
      React.createElement("h1", null, "Suno Generate – tiszta indulás"),
      React.createElement("p", null, "Más module scriptek eltávolítva; egyetlen render fut.")
    );
  }

  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
}
