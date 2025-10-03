// src/components/Sidebar/Sidebar.tsx (UPDATED)

import React from "react";
import styles from "./Sidebar.module.css";
import SidebarNav from "./SidebarNav";

type CurrentView = "MyFiles" | "Shared" | "Trash" | "Settings";

interface SidebarProps {
  onNavClick: (view: CurrentView) => void;
  currentActiveView: CurrentView;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, currentActiveView }) => {
  return (
    <div className={styles.sidebar}>
      {/* Upper Section: Navigation - Props pass kiye */}
      <SidebarNav
        onNavClick={onNavClick}
        currentActiveView={currentActiveView}
      />

      {/* Lower Section: Storage Status */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Storage: 10 GB of 50 GB used
        </p>
        {/* Yahan progress bar aayegi */}
        <div
          style={{
            height: "5px",
            backgroundColor: "#333",
            borderRadius: "5px",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              width: "20%" /* Example: 10/50 = 20% */,
              height: "100%",
              backgroundImage:
                "linear-gradient(to right, #fb923c, var(--color-primary))",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
