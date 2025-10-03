import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// 1. React Router DOM se BrowserRouter import karein
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 2. App component ko BrowserRouter se wrap karein */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
