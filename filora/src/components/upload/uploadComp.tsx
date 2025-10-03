// File: src/components/upload/UploadComp.tsx

import React, { useState, useRef } from "react";
import styles from "./uploadComp.module.css";
import { api } from "../../global/api";

interface UploadCompProps {
  onClose: () => void;
}

export default function UploadComp({ onClose }: UploadCompProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFolder, setTargetFolder] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 0 se 100
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1️⃣ File select handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (selectedFiles.length + newFiles.length > 10) {
        alert(`Aik waqt mein sirf 10 files tak upload kar sakte hain.`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);

      // Reset input value to allow selecting same file again
      setTimeout(() => {
        event.target.value = "";
      }, 0);
    }
  };

  // 2️⃣ Remove file
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // 3️⃣ Upload button click
  // File: src/components/upload/UploadComp.tsx (handleUploadClick update)

  // ... (Existing handlers)

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0)
      return alert("Pehle koi file choose karain.");

    // Upload shuru karne se pehle
    setIsUploading(true);
    setUploadProgress(0); // Progress reset kiya

    const formData = new FormData();
    const folderName = targetFolder.trim();

    // Files ko FormData mein daala
    selectedFiles.forEach((file) => {
      formData.append("files", file); // 'files' wahi naam hai jo Multer backend mein use kar raha hai
    });

    // Folder name ko daala
    if (folderName) {
      formData.append("foldername", folderName);
    }

    try {
      const response = await api.post(
        "/upload", // Aap ka backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Zaroori
            // JWT token yahan headers ya cookies mein automatically hona chahiye
          },
          // 🎯 PROGRESS TRACKING MAGIC YAHAN HAI 🎯
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      // Success hone par
      alert("Upload Complete! " + response.data.uploaded.length + " files.");
      setSelectedFiles([]); // Files list clear ki
      setUploadProgress(100);
      // IndexedDB update ki logic yahan aayegi
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload mein ghalti ho gayi.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false); // Upload khatam
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <h2 className={styles.headerTitle}>Upload Files</h2>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* Folder Input */}
        <div className={styles.folderSelection}>
          <label htmlFor="folderName">Target Folder:</label>
          <input
            id="folderName"
            type="text"
            placeholder="Folder name (optional)"
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className={styles.folderInput}
          />
        </div>

        {/* File selection area */}
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className={styles.dropText}>Click here to select files</p>
          <p className={styles.limitText}>Max 10 files | Max 100MB per file</p>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="*/*"
            style={{ display: "none" }}
          />
        </div>

        {/* File list */}
        <div className={styles.fileList}>
          {selectedFiles.length > 0 ? (
            selectedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveFile(index)}
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <p className={styles.emptyList}>No files selected.</p>
          )}
        </div>

        {/* Upload button */}
        <button
          className={styles.mainUploadButton}
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || isUploading} // Upload ke dauran disable kiya
        >
          {isUploading
            ? `Uploading... ${uploadProgress}%`
            : `Upload ${selectedFiles.length} File(s)`}
        </button>
        {isUploading && uploadProgress < 100 && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
