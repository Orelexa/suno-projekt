// main.js
import React from "react";
import { createRoot } from "react-dom/client";
// import { Wand2 } from "lucide-react"; // ha kell ikon
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  return React.createElement("main", { style: "padding:24px;color:#fff" },
    React.createElement("h1", null, "Saját App")
  );
}

const root = globalThis.__APP_ROOT__ || (globalThis.__APP_ROOT__ = createRoot(document.getElementById("root")));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
