// src/pages/Trash/Trash.tsx

import React from "react";
import styles from "./Trash.module.css";

const MOCK_TRASH_FILES = [
  {
    id: 101,
    name: "Old Client Data.zip",
    size: "150 MB",
    dateDeleted: "2025-09-20",
    daysLeft: 10,
  },
  {
    id: 102,
    name: "Rough Draft.docx",
    size: "50 KB",
    dateDeleted: "2025-09-28",
    daysLeft: 2,
  },
  {
    id: 103,
    name: "Duplicate Photo.jpg",
    size: "1.1 MB",
    dateDeleted: "2025-09-05",
    daysLeft: 25,
  },
];

const Trash: React.FC = () => {
  return (
    <div className={styles.trashContainer}>
      {/* 1. Trash Actions Toolbar */}
      <div className={styles.actionToolbar}>
        <div className={styles.infoText}>
          Items in trash are automatically deleted after 30 days.
        </div>
        <div>
          <button className={`${styles.actionBtn} ${styles.restoreBtn}`}>
            🔄 Restore All
          </button>
          <button className={`${styles.actionBtn} ${styles.emptyBtn}`}>
            🔥 Empty Trash
          </button>
        </div>
      </div>

      {/* 2. File Listing Area */}
      <div className={styles.fileListWrapper}>
        {/* List Header */}
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.nameCol}>File Name</div>
          <div className={styles.sizeCol}>Size</div>
          <div className={styles.dateCol}>Date Deleted</div>
          <div className={styles.daysCol}>Days Left</div>
          <div className={styles.actionCol}></div>{" "}
          {/* Restore/Delete button ke liye */}
        </div>

        {/* Files */}
        {MOCK_TRASH_FILES.map((file) => (
          <div key={file.id} className={styles.row}>
            <div className={styles.nameCol}>🗑️ {file.name}</div>
            <div className={styles.sizeCol}>{file.size}</div>
            <div className={styles.dateCol}>{file.dateDeleted}</div>
            <div className={styles.daysCol} data-days-left={file.daysLeft}>
              {file.daysLeft} days left
            </div>
            <div className={styles.actionCol}>
              <button className={styles.restoreRowBtn}>Restore</button>
            </div>
          </div>
        ))}

        {MOCK_TRASH_FILES.length === 0 && (
          <p className={styles.noFiles}>Trash is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Trash;
