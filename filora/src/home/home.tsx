// src/pages/Home.tsx (Ya jahan bhi aap Home component rakhte hain)

import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MyFiles from "../pages/MyFiles/MyFiles";
import Shared from "../pages/Shared/Shared";
import Trash from "../pages/Trash/Trash";
import Settings from "../pages/Settings/Settings";
import styles from "./Home.module.css"; // Nayi CSS file
import { useNavigate } from "react-router-dom";
// Nav Options Typescript ke liye (optional, lekin accha hai)
type CurrentView = "MyFiles" | "Shared" | "Trash" | "Settings";

export default function Home() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const check = localStorage.getItem("is_login");

    if (!check) {
      navigate("/welcome", { replace: true });
    } else {
      setLogin(true);
    }
  });

  // State for active content
  const [currentView, setCurrentView] = useState<CurrentView>("MyFiles");

  // Sidebar se click hone par state update karne ka function
  const handleNavClick = (view: CurrentView) => {
    setCurrentView(view);
  };

  // State ke hisaab se content render karna
  const renderContent = () => {
    switch (currentView) {
      case "MyFiles":
        return <MyFiles />;
      case "Trash":
        return <Trash />;
      case "Shared":
        return <Shared />;
      case "Settings":
        return <Settings />;
      default:
        return <MyFiles />;
    }
  };

  if (!login) {
    return "";
  }
  return (
    // 'main' container
    <div className={styles.homeContainer}>
      <Header />

      {/* Sidebar aur Content Area ko side-by-side lane ke liye */}
      <div className={styles.mainContentFlex}>
        {/* Sidebar ko props bhejen ge */}
        <Sidebar onNavClick={handleNavClick} currentActiveView={currentView} />

        {/* Dynamic Content Area */}
        <main className={styles.contentArea}>{renderContent()}</main>
      </div>
    </div>
  );
}
