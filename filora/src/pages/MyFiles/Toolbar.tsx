import React from "react";
import { useSetAtom } from "jotai";
import styles from "./Toolbar.module.css";
import { createFolderModalAtom } from "../../states/States";

const Toolbar: React.FC = () => {
  const setCreateFolderModal = useSetAtom(createFolderModalAtom);

  return (
    <div className={styles.toolbar}>
      <div className={styles.leftActions}>
        <button
          className={styles.newFolderBtn}
          onClick={() => setCreateFolderModal(true)}
        >
          ➕ New Folder
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
