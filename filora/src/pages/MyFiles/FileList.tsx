// src/components/FileBrowser/FileList.tsx

import React from "react";
import styles from "./FileList.module.css";

// 🎯 Backend se aane wale data ke liye Interface
interface FileItem {
  name: string;
  id: number;
  is_folder: boolean;
  size?: string; // Backend se string (bytes) mein aa raha hai
  mime_type?: string;
  uuid: string;
  // created_at, etc. bhi ho sakti hain
}
interface Prop {
  fileList: any;
  loading: any;
  loadFolder: (id: number, name: string) => void;
  backFolder: () => void;
  openFile: (fileUUID: string, fileName: string, mimeType: string) => void;
}

// Helper function to convert Bytes to Human Readable Size
const formatBytes = (bytes: string | undefined): string => {
  if (!bytes) return "-";
  const num = parseInt(bytes, 10);
  if (num === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to determine icon and type based on mime_type/is_folder
const getItemDetails = (item: FileItem) => {
  if (item.is_folder) {
    return { icon: "📁", type: "Folder", sizeDisplay: "-" };
  }

  const mime = item.mime_type || "";
  const sizeDisplay = formatBytes(item.size);

  if (mime.startsWith("image/")) {
    return { icon: "🖼️", type: "Image", sizeDisplay };
  }
  if (mime === "application/pdf") {
    return { icon: "📄", type: "PDF", sizeDisplay };
  }
  if (mime === "application/zip" || mime === "application/x-zip-compressed") {
    return { icon: "📦", type: "ZIP Archive", sizeDisplay };
  }
  if (mime.startsWith("video/")) {
    return { icon: "📹", type: "Video", sizeDisplay };
  }
  if (mime.startsWith("text/")) {
    return { icon: "📝", type: "Text File", sizeDisplay };
  }
  return { icon: "❓", type: "File", sizeDisplay };
};

const FileList: React.FC<Prop> = ({
  fileList,
  loading,
  loadFolder,
  backFolder,
  openFile,
}: Prop) => {
  const today = new Date().toLocaleDateString();

  return (
    <div className={styles.fileListContainer}>
      {/* Table Header */}
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.nameCol}>Name</div>
        <div className={styles.typeCol}>Type</div>
        <div className={styles.sizeCol}>Size</div>
        <div className={styles.dateCol}>Last Modified</div>
      </div>

      {loading && <div className={styles.loading}>Loading files...</div>}

      {!loading && fileList.length === 0 && (
        <div className={styles.empty}>This folder is empty.</div>
      )}

      {/* File/Folder Listing */}
      <div className={styles.row} onClick={backFolder}>
        <div className={styles.nameCol}>
          <span className={styles.fileIcon}>🔙</span>
          back
        </div>
      </div>
      {!loading &&
        fileList.map((file: any) => {
          const details = getItemDetails(file);

          return (
            <div
              key={file.uuid}
              className={styles.row}
              onClick={() => {
                if (details.type == "Folder") {
                  loadFolder(file.uuid, file.name);
                }
              }}
            >
              <div
                className={styles.nameCol}
                onClick={() => {
                  if (details.type !== "Folder") {
                    openFile(
                      file.uuid,
                      file.name,
                      file.mime_type || "application/octet-stream"
                    );
                  }
                }}
              >
                <span className={styles.fileIcon}>{details.icon}</span>
                {file.name}
              </div>
              <div className={styles.typeCol}>{details.type}</div>
              <div className={styles.sizeCol}>{details.sizeDisplay}</div>
              {/* Last Modified/Created Date ko baad mein set karain ge */}
              <div className={styles.dateCol}>{today}</div>
            </div>
          );
        })}
    </div>
  );
};

export default FileList;
