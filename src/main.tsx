import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@iantroisi/ui/styles.css";
import { App } from "./App";
import "./site.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
