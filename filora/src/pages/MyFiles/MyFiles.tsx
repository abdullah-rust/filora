// src/pages/MyFiles/MyFiles.tsx

import React from "react";
import styles from "./MyFiles.module.css";
import Toolbar from "./Toolbar";
import FileList from "./FileList";
import { currentFolderPathAtom } from "../../states/States";
import { useAtom } from "jotai";

const MyFiles: React.FC = () => {
  const [folders] = useAtom(currentFolderPathAtom);
  return (
    <div className={styles.myFiles}>
      {/* 📂 Breadcrumb */}
      <div className={styles.breadcrumb}>
        {folders &&
          folders.map((name, id) => (
            <span
              key={id}
              className={
                folders.length - 1 === id
                  ? styles.currentFolder
                  : styles.breadcrumbLink
              }
            >
              /{name}
            </span>
          ))}
      </div>
      <Toolbar />
      <div className={styles.fileListing}>
        <FileList />
      </div>
    </div>
  );
};

export { MyFiles };
