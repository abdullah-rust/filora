// src/pages/Shared/Shared.tsx

import React, { useState } from "react";
import styles from "./Shared.module.css";
// import FileList from "../MyFiles/FileList"; // FileList component reusable hai

// Dummy data for Shared Files
const SHARED_BY_ME = [
  {
    id: 1,
    name: "Marketing Plan.pdf",
    size: "5 MB",
    sharedWith: "Ali (Editor)",
    lastShared: "2025-09-25",
  },
  {
    id: 2,
    name: "Team Photos",
    size: "-",
    sharedWith: "Zoya (Viewer)",
    lastShared: "2025-09-10",
  },
];

const SHARED_WITH_ME = [
  {
    id: 3,
    name: "Budget 2026.xlsx",
    size: "1 MB",
    sharedBy: "Fahad",
    access: "Editor",
    lastShared: "2025-09-28",
  },
  {
    id: 4,
    name: "HR Guidelines.docx",
    size: "200 KB",
    sharedBy: "Sana",
    access: "Viewer",
    lastShared: "2025-09-01",
  },
];

type SharedView = "SharedByMe" | "SharedWithMe";

const Shared: React.FC = () => {
  const [currentSharedView, setCurrentSharedView] =
    useState<SharedView>("SharedWithMe");

  // Decide which data to display
  const filesToDisplay =
    currentSharedView === "SharedByMe" ? SHARED_BY_ME : SHARED_WITH_ME;

  return (
    <div className={styles.sharedContainer}>
      {/* 1. View Toggles (Shared By Me / Shared With Me) */}
      <div className={styles.toggleBar}>
        <button
          onClick={() => setCurrentSharedView("SharedWithMe")}
          className={`${styles.toggleBtn} ${
            currentSharedView === "SharedWithMe" ? styles.activeToggle : ""
          }`}
        >
          Shared With Me
        </button>
        <button
          onClick={() => setCurrentSharedView("SharedByMe")}
          className={`${styles.toggleBtn} ${
            currentSharedView === "SharedByMe" ? styles.activeToggle : ""
          }`}
        >
          Shared By Me
        </button>
      </div>

      {/* 2. Main Listing Area - FileList reusable hona chahiye */}
      <div className={styles.sharedListing}>
        {/* Filhaal hum FileList component ko thoda customize kar ke use karain ge. 
           Lekin isay List ki tarah dikhaana hai. */}
        <h2>
          {currentSharedView === "SharedWithMe"
            ? "Files shared with you"
            : "Files you have shared"}
        </h2>

        {/* Yahan hum doosra Table ya List banayenge jo shared info dikhaye */}
        <div className={styles.fileListWrapper}>
          {/* Abhi FileList ko direct use nahi kar sakte kyunki is ki columns alag hain. 
                Is liye hum ek simple table structure banate hain. */}
          <div className={`${styles.row} ${styles.headerRow}`}>
            <div className={styles.nameCol}>File Name</div>
            <div className={styles.statusCol}>
              {currentSharedView === "SharedByMe" ? "Shared With" : "Shared By"}
            </div>
            <div className={styles.accessCol}>Access</div>
            <div className={styles.dateCol}>Last Shared</div>
          </div>

          {filesToDisplay.map((file: any, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.nameCol}>
                {/* Icon Placeholder */} 📁 {file.name}
              </div>
              <div className={styles.statusCol}>
                {file.sharedWith || file.sharedBy}
              </div>
              <div className={styles.accessCol}>
                {file.access ||
                  (file.sharedWith
                    ? file.sharedWith.includes("Editor")
                      ? "Editor"
                      : "Viewer"
                    : "")}
              </div>
              <div className={styles.dateCol}>{file.lastShared}</div>
            </div>
          ))}
          {filesToDisplay.length === 0 && (
            <p className={styles.noFiles}>Nothing to show here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shared;
