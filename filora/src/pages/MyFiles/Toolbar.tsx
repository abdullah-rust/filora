// src/components/FileBrowser/Toolbar.tsx (Updated)

import React from "react";
import styles from "./Toolbar.module.css"; // Styling import kiya

const Toolbar: React.FC = () => {
  return (
    // Styling class lagayi
    <div className={styles.toolbar}>
      {/* Left Side Actions */}
      <div className={styles.leftActions}>
        <button className={styles.newFolderBtn}>➕ New Folder</button>
      </div>

      {/* Right Side Options */}
      <div className={styles.rightActions}>
        <select className={styles.sortSelect}>
          <option>Sort by Name</option>
          <option>Sort by Date</option>
          <option>Sort by Size</option>
        </select>
        <button className={styles.viewToggleBtn}>
          {/* Icon Placeholder */}☰ List View
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
