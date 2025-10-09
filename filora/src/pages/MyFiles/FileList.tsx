// src/components/FileBrowser/FileList.tsx (Final Split Code)

import React from "react";
import styles from "./FileList.module.css";
// NOTE: Assuming these imports are correctly defined in your project
import { useFetchMyfiles } from "../../Api/MyfileApi";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import FileListItem from "./FileListItem"; // ✅ New Component Import

import type { FileItem } from "../../Types/Types";
import {
  selectedFolderIdsAtom,
  currentFolderPathAtom,
  filesAtom,
  fileStreamAtom,
  fileOptionsVisibleAtom,
  fileOptionsItemId,
  fileOptionsItemNameAtom,
  itemTypeOption,
  copyLinkUUid,
  isPublicOptionAtom,
} from "../../states/States";

const FileList: React.FC = () => {
  // 🎯 Fetch the data on mount
  useFetchMyfiles();

  // 📦 Get global file list from Jotai
  const fileList: FileItem[] = useAtomValue(filesAtom) || [];
  const loading = false; // (You can add loading atom later)
  const today = new Date().toLocaleDateString();

  // Jotai Setters/Getters
  const [SelectedFileId, setSelectedFileId] = useAtom(selectedFolderIdsAtom);
  const setStream = useSetAtom(fileStreamAtom);
  const [FolderName, setFolderName] = useAtom(currentFolderPathAtom);
  const setOptionsVisible = useSetAtom(fileOptionsVisibleAtom);
  const setOptionItemName = useSetAtom(fileOptionsItemNameAtom);
  const setOptionItemId = useSetAtom(fileOptionsItemId);
  const SetItemOptionType = useSetAtom(itemTypeOption);
  const setLink = useSetAtom(copyLinkUUid);
  const SetPublicOption = useSetAtom(isPublicOptionAtom);

  // 1. Option Menu Handler (Logic moved here)
  const optionHandleclick = (
    name: string,
    id: number,
    ItemType: string,
    uuid: string,
    is_public: boolean
  ) => {
    SetPublicOption(is_public);
    setLink(uuid);
    SetItemOptionType(ItemType);
    setOptionItemId(id);
    setOptionItemName(name);
    setOptionsVisible(true);
  };

  // 2. File/Folder Click Handler (Logic moved here)
  const handleFileClick = (file: FileItem) => {
    if (file.is_folder) {
      setSelectedFileId([...SelectedFileId, file.id]);
      setFolderName([...FolderName, file.name]);
    } else {
      setStream({
        fileUUID: file.uuid,
        fileName: file.name,
        mimeType: file.mime_type || "application/octet-stream",
        visible: true,
      });
      console.log(file.uuid);
    }
  };

  return (
    <div className={styles.fileListContainer}>
      {/* Table Header */}
      <div className={`${styles.row} ${styles.headerRow}`}>
        <div className={styles.nameCol}>Name</div>
        <div className={styles.typeCol}>Type</div>
        <div className={styles.sizeCol}>Size</div>
        <div className={styles.dateCol}>Last Modified</div>
        <div className={styles.optionsCol}></div>
      </div>

      {loading && <div className={styles.loading}>Loading files...</div>}

      {/* Back Button */}
      <div
        className={styles.row}
        onClick={() => {
          setSelectedFileId(SelectedFileId.slice(0, -1));
          if (SelectedFileId.length > 0) {
            setFolderName(FolderName.slice(0, -1));
          }
        }}
      >
        <div className={styles.nameCol}>
          <span className={styles.fileIcon}>🔙</span>
          <span className={styles.fileNameText}>...</span>
        </div>
      </div>

      {/* 🎯 Render actual data from API */}
      {!loading && fileList.length > 0 ? (
        fileList.map((file, index) => (
          // ✅ New component use kiya aur handlers pass kiye
          <FileListItem
            key={file.id || index}
            file={file}
            index={index}
            today={today}
            onFileClick={() => handleFileClick(file)}
            onOptionClick={optionHandleclick}
          />
        ))
      ) : (
        <div className={styles.emptyState}>No files found.</div>
      )}
    </div>
  );
};

export default FileList;
