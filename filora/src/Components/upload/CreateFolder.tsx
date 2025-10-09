import styles from "./createFolder.module.css";
import React, { useState } from "react";
import { api } from "../../global/api";
import { useAtom } from "jotai";
import {
  createFolderModalAtom,
  selectedFolderIdsAtom,
  createFolderParentNameAtom,
  filesAtom,
} from "../../states/States";
import type { FileItem } from "../../Types/Types";
import { setItem } from "../../utils/localForageUtils"; // ✅ localForage helper

export default function CreateFolder() {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Jotai atoms
  const [, setModalOpen] = useAtom(createFolderModalAtom);
  const [selectedFolderIds] = useAtom(selectedFolderIdsAtom);
  const parentId = selectedFolderIds[selectedFolderIds.length - 1] ?? null;

  const [parentName] = useAtom(createFolderParentNameAtom);
  const [myFiles, setMyFiles] = useAtom(filesAtom);

  // 🚀 Folder creation function
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (folderName.trim().length === 0) {
      setError("Folder name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      // ✅ API Call
      const res = await api.post("/create-folder", {
        name: folderName.trim(),
        parentId: parentId || null,
      });

      const newFolder: FileItem = {
        id: res.data.folder.id,
        name: folderName,
        is_folder: true,
        uuid: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      // ✅ update local state
      const updatedFiles = [...myFiles, newFolder];
      setMyFiles(updatedFiles);

      // ✅ save to localForage (offline cache)
      await setItem(
        parentId == null ? "root" : parentId.toString(),
        updatedFiles
      );

      // ✅ reset modal
      setFolderName("");
      setModalOpen(false);
    } catch (err: any) {
      console.error("Folder creation failed:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to create folder. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.backdrop}>
      <div className={styles.container}>
        <h2 className={styles.headerTitle}>Create New Folder</h2>
        <button
          className={styles.closeButton}
          onClick={() => setModalOpen(false)}
        >
          &times;
        </button>

        <form onSubmit={handleCreate} className={styles.form}>
          <p className={styles.parentInfo}>
            Creating in: <b>{parentId ? parentName : "Root Directory"}</b>
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor="folderName" className={styles.label}>
              Folder Name
            </label>
            <input
              id="folderName"
              type="text"
              className={styles.inputField}
              placeholder="e.g., Photos_2025"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>🚨 {error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.createButton}
              disabled={loading || folderName.trim().length === 0}
            >
              {loading ? "Creating..." : "Create Folder ➕"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
