import React from "react";
import styles from "./Header.module.css";
import { sidebarOpenAtom } from "../../states/States";
import { useAtom, useSetAtom } from "jotai";
import { uploadModalAtom } from "../../states/States";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSideBarOpen] = useAtom(sidebarOpenAtom);
  const setUploadModal = useSetAtom(uploadModalAtom);
  return (
    <header className={styles.header}>
      <div className={styles.leftActions}>
        <button
          className={styles.menuIcon}
          onClick={() => setIsSideBarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      </div>

      <div className={styles.centerArea}>
        <h1 className={styles.logoText}>FILORA</h1>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.uploadButton}
          onClick={() => {
            setUploadModal(true);
          }}
        >
          + Upload
        </button>
      </div>
    </header>
  );
};

export default Header;
