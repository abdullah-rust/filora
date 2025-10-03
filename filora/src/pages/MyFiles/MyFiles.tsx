// src/pages/MyFiles/MyFiles.tsx

import React, { useEffect, useState } from "react";
import styles from "./MyFiles.module.css";
import Toolbar from "./Toolbar";
import FileList from "./FileList";
import { api } from "../../global/api";
import Stream from "../Stream/Stream";

// 🎯 Backend se aane wale data ke liye Interface
interface FileItem {
  name: string;
  id: number;
  is_folder: boolean;
  size?: string;
  mime_type?: string;
  uuid: string;
}

interface FileListObject {
  [key: string]: FileItem;
}
const MyFiles: React.FC = () => {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [folderIdHistory, setFolderIdHistory] = useState<(number | null)[]>([
    null,
  ]);
  const [folders, setFolders] = useState<string[]>(["Home", "My Files"]);
  const [stream, setStream] = useState(false);
  const [filinfo, setFileInfo] = useState<any>({});

  useEffect(() => {
    getData();
  }, [folderIdHistory]);

  async function getData() {
    setLoading(true);
    try {
      const currentFolderId = folderIdHistory[folderIdHistory.length - 1];

      const folderIdParam =
        currentFolderId !== null ? `?folderId=${currentFolderId}` : "";

      const res = await api.get(`/get-data${folderIdParam}`);

      // ... (Baaki data parsing logic wahi rahegi) ...
      const fileObject: FileListObject = res.data.data;
      const filesArray: FileItem[] = Object.values(fileObject);

      filesArray.sort((a, b) => {
        if (a.is_folder && !b.is_folder) return -1;
        if (!a.is_folder && b.is_folder) return 1;
        return a.name.localeCompare(b.name);
      });

      setFileList(filesArray);
    } catch (e) {
      console.error("File loading failed:", e);
      setFileList([]);
    } finally {
      setLoading(false);
    }
  }

  function loadFolder(id: number | null, name: string) {
    if (id === null) {
      setFolderIdHistory([null]);
      setFolders(["Home", "My Files"]);
    } else {
      setFolderIdHistory([...folderIdHistory, id]);

      setFolders([...folders, name]);
    }
  }
  function backFolder() {
    if (folderIdHistory.length > 1) {
      const newIdHistory = folderIdHistory.slice(0, folderIdHistory.length - 1);

      const newNameHistory = folders.slice(0, folders.length - 1);

      setFolderIdHistory(newIdHistory);
      setFolders(newNameHistory);
    }
  }

  function streamOpen(fileUUID: string, fileName: string, mimeType: string) {
    setFileInfo({
      fileUUID,
      fileName,
      mimeType,
    });

    setStream(true);
  }

  function streamClose() {
    setStream(false);
  }

  return (
    <div className={styles.myFiles}>
      <div className={styles.breadcrumb}>
        {/* Placeholder: Breadcrumb ko baad mein banaenge. Abhi home par hain. */}
        {folders &&
          folders.map((name, id) => (
            <span
              key={id}
              className={
                folders.length - 1 == id
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
        <FileList
          loading={loading}
          fileList={fileList}
          loadFolder={loadFolder}
          backFolder={backFolder}
          openFile={streamOpen}
        />
      </div>
      {stream && (
        <Stream
          onClose={streamClose}
          fileName={filinfo.fileName}
          fileUUID={filinfo.fileUUID}
          mimeType={filinfo.mimeType}
        />
      )}
    </div>
  );
};

export default MyFiles;
