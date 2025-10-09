// src/components/FileBrowser/FileListItem.tsx (Updated with Public Icon)

import React from "react";
import styles from "./FileList.module.css";
import type { FileItem } from "../../Types/Types";

// 💡 Helper Functions (No change here)
const formatBytes = (bytes: string | null): string => {
  // ... (unchanged formatBytes logic)
  if (!bytes) return "-";
  const num = parseInt(bytes, 10);
  if (num === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getItemDetails = (item: FileItem) => {
  // ... (unchanged getItemDetails logic)
  if (item.is_folder) {
    return { icon: "📁", type: "Folder", sizeDisplay: "-" };
  }
  if (item.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return {
      icon: "🖼️",
      type: "Image",
      sizeDisplay: formatBytes(item.size || ""),
    };
  }
  if (item.name.match(/\.(pdf)$/i)) {
    return {
      icon: "📄",
      type: "PDF",
      sizeDisplay: formatBytes(item.size || ""),
    };
  }
  return {
    icon: "📦",
    type: "File",
    sizeDisplay: formatBytes(item.size || ""),
  };
};

interface FileListItemProps {
  file: FileItem;
  index: number;
  today: string;
  onFileClick: () => void;
  onOptionClick: (
    name: string,
    id: number,
    itemType: string,
    uuid: string,
    is_public: boolean
  ) => void;
}

const FileListItem: React.FC<FileListItemProps> = ({
  file,
  index,
  today,
  onFileClick,
  onOptionClick,
}) => {
  const details = getItemDetails(file);
  const isPublic = file.is_folder ? false : file.is_public; // ✅ is_public value use ki

  return (
    <div key={file.id || index} className={styles.row}>
      <div className={styles.nameCol} onClick={onFileClick}>
        <span className={styles.fileIcon}>{details.icon}</span>

        {/* ✅ Public Icon: Agar file public ho to yahan dikhao */}
        {isPublic && (
          <span
            className={styles.publicIcon}
            title="Publicly Shared" // Hover par label dikhane ke liye
          >
            🔗
          </span>
        )}

        {/* File Name for truncation */}
        <span className={styles.fileNameText}>{file.name}</span>
      </div>
      <div className={styles.typeCol}>{details.type}</div>
      <div className={styles.sizeCol}>{details.sizeDisplay}</div>
      <div className={styles.dateCol}>
        {file.created_at
          ? new Date(file.created_at).toLocaleDateString()
          : today}
      </div>

      {/* 3-Dot Options Column */}
      <div className={styles.optionsCol}>
        <button
          className={styles.optionsButton}
          onClick={(e) => {
            e.stopPropagation(); // Zaroori: Taa-ke row ka click (folder open/stream) na ho
            onOptionClick(
              file.name,
              file.id,
              file.is_folder ? "folder" : "file",
              file.uuid,
              file.is_public
            );
          }}
        >
          •••
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
