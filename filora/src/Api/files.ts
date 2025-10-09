// src/hooks/useFileActions.ts (Updated for Public/Private Sync)

import { api } from "../global/api";
import { useSetAtom, useAtomValue } from "jotai";
import { alertAtom, filesAtom, selectedFolderIdsAtom } from "../states/States";
import { getItem, setItem } from "../utils/localForageUtils";
import type { FileItem } from "../Types/Types"; // Assuming FileItem type exists

/**
 * useFileActions()
 * Handles delete / public / private actions for files & folders
 * with full UI + cache sync.
 */
export function useFileActions() {
  const setAlert = useSetAtom(alertAtom);
  const setFiles = useSetAtom(filesAtom);
  const folderIdHistory = useAtomValue(selectedFolderIdsAtom);

  // Helper function to handle cache update (repeated logic ko saaf kiya)
  const syncCacheAndUI = async (id: number, isPublicState: boolean) => {
    // 1. UI Update (Jotai filesAtom)
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_public: isPublicState } : f))
    );

    // 2. Cache Update (localForage)
    const currentFolderId =
      folderIdHistory.length > 0
        ? folderIdHistory[folderIdHistory.length - 1].toString()
        : "root";

    const cached: FileItem[] | null = await getItem(currentFolderId);
    if (cached) {
      const updatedCache = cached.map((f) =>
        f.id === id ? { ...f, is_public: isPublicState } : f
      );
      await setItem(currentFolderId, updatedCache);
    }
  };

  /** 🗑 Delete file or folder (Unchanged, for context) */
  const deleteItem = async (id: number, type: string) => {
    try {
      const res = await api.post("/delete", { id, type });

      // ✅ Remove from UI
      setFiles((prev) => prev.filter((f) => f.id !== id));

      // ✅ Remove from cache (localForage)
      const currentFolderId =
        folderIdHistory.length > 0
          ? folderIdHistory[folderIdHistory.length - 1].toString()
          : "root";

      const cached = await getItem(currentFolderId);
      if (cached) {
        const updatedCache = cached.filter((f: any) => f.id !== id);
        await setItem(currentFolderId, updatedCache);
      }

      // ✅ Alert
      setAlert({
        message: `${type === "file" ? "File" : "Folder"} deleted successfully.`,
        type: "success",
        visible: true,
      });

      return res.data;
    } catch (err: any) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      setAlert({
        message: err.response?.data?.message || "Failed to delete item.",
        type: "error",
        visible: true,
      });
      throw err;
    }
  };

  /** 🌍 Make file or folder public (Updated) */
  const makePublic = async (id: number, type: string) => {
    try {
      const res = await api.post("/public", { id, type });

      // ✅ UI aur Cache ko sync karo
      await syncCacheAndUI(id, true);

      setAlert({
        message: `${type === "file" ? "File" : "Folder"} is now public.`,
        type: "success",
        visible: true,
      });
      return res.data;
    } catch (err: any) {
      console.error("❌ Make public error:", err.response?.data || err.message);
      setAlert({
        message: err.response?.data?.message || "Failed to make public.",
        type: "error",
        visible: true,
      });
      throw err;
    }
  };

  /** 🔒 Make file or folder private (Updated) */
  const makePrivate = async (id: number, type: string) => {
    try {
      const res = await api.post("/private", { id, type });

      // ✅ UI aur Cache ko sync karo
      await syncCacheAndUI(id, false);

      setAlert({
        message: `${type === "file" ? "File" : "Folder"} is now private.`,
        type: "success",
        visible: true,
      });
      return res.data;
    } catch (err: any) {
      console.error(
        "❌ Make private error:",
        err.response?.data || err.message
      );
      setAlert({
        message: err.response?.data?.message || "Failed to make private.",
        type: "error",
        visible: true,
      });
      throw err;
    }
  };

  return { deleteItem, makePublic, makePrivate };
}
