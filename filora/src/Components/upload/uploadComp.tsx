import React, { useState, useRef } from "react";
import styles from "./uploadComp.module.css";
import { api } from "../../global/api";
import { useAtom } from "jotai";
import {
  selectedFolderIdsAtom,
  currentFolderPathAtom,
  uploadModalAtom,
  filesAtom,
} from "../../states/States";
import { setItem, saveBlobToCache } from "../../utils/localForageUtils";

export default function UploadComp() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [getFiles, setFiles] = useAtom(filesAtom);
  const [folderIdHistory] = useAtom(selectedFolderIdsAtom);
  const [folders] = useAtom(currentFolderPathAtom);
  const [, setUploadModal] = useAtom(uploadModalAtom);

  // 📂 Select files
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      if (selectedFiles.length + newFiles.length > 20) {
        alert(`Aik waqt mein sirf 10 files tak upload kar sakte hain.`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setTimeout(() => (event.target.value = ""), 0);
    }
  };

  // ❌ Remove selected file
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // 🚀 Upload Handler
  const handleUploadClick = async () => {
    if (selectedFiles.length === 0)
      return alert("Pehle koi file choose karain.");

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const folderId =
        folderIdHistory.length > 0
          ? folderIdHistory[folderIdHistory.length - 1]
          : null;

      const url = folderId ? `/upload/${folderId}` : `/upload/root`; // 👈 fallback

      const response = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      const uploadedFiles = response.data.uploaded;

      // 🧠 Convert uploaded files to FileItem objects (to match structure)
      const newFileObjects = uploadedFiles.map((file: any, index: number) => {
        const original = selectedFiles[index];
        return {
          name: original.name,
          is_folder: false,
          size: original.size,
          mime_type: original.type,
          uuid: file.uuid,
          id: file.id, // ✅ use real DB ID instead of fake one
        };
      });

      // 📥 Cache blobs for instant offline preview
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const blob = file.slice(0, file.size, file.type);
        const newUuid = uploadedFiles[i]?.uuid;
        if (newUuid) {
          await saveBlobToCache(newUuid, blob);
        }
      }

      // 📦 Merge with existing files atom
      setFiles((prevFiles) => {
        const updated = [...prevFiles, ...newFileObjects];
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });

      // 💾 Save updated file list to localForage cache
      const cacheKey =
        folderIdHistory.length > 0
          ? folderIdHistory[folderIdHistory.length - 1].toString()
          : "root";

      await setItem(cacheKey, getFiles.concat(newFileObjects));

      // 🎉 Success
      alert("✅ Upload Complete! " + uploadedFiles.length + " files.");
      setSelectedFiles([]);
      setUploadProgress(100);
      setUploadModal(false);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("File upload mein ghalti ho gayi.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <h2 className={styles.headerTitle}>Upload Files</h2>

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

        {/* ❌ Close */}
        <button
          className={styles.closeButton}
          onClick={() => setUploadModal(false)}
        >
          &times;
        </button>

        {/* 📂 Drop Zone */}
        <div
          className={styles.dropZone}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className={styles.dropText}>Click here to select files</p>
          <p className={styles.limitText}>
            You can upload up to 20 files. For large files (e.g., 5GB or more),
            please upload them individually to ensure smooth performance.
          </p>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="*/*"
            style={{ display: "none" }}
          />
        </div>

        {/* 📃 File list */}
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

        {/* 🚀 Upload button */}
        <button
          className={styles.mainUploadButton}
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || isUploading}
        >
          {isUploading
            ? `Uploading... ${uploadProgress}%`
            : `Upload ${selectedFiles.length} File(s)`}
        </button>

        {/* 📊 Progress bar */}
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
