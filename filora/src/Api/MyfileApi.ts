import { useEffect, useCallback } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { filesAtom, selectedFolderIdsAtom, alertAtom } from "../states/States";
import { api } from "../global/api";
import type { FileItem, FileListObject } from "../Types/Types";
import { setItem } from "../utils/localForageUtils";
import { getItem } from "localforage";

export function useFetchMyfiles() {
  const setMyFiles = useSetAtom(filesAtom);
  const SelectedFileId = useAtomValue(selectedFolderIdsAtom);
  const setAlert = useSetAtom(alertAtom);

  const getData = useCallback(async () => {
    try {
      const currentFolderId =
        SelectedFileId.length > 0
          ? SelectedFileId[SelectedFileId.length - 1]
          : null;

      const folderIdParam =
        currentFolderId !== null ? `?folderId=${currentFolderId}` : "";

      // 🔹 API se data fetch karo
      const res = await api.get(`/get-data${folderIdParam}`);
      const fileObject: FileListObject = res.data.data;
      console.log(res.data.data);

      const filesArray: FileItem[] = Object.values(fileObject);
      console.log(filesArray);

      // 🔹 LocalForage me store karo
      await setItem(`${currentFolderId || "root"}`, filesArray);

      const sorted = sortFiles(filesArray, "name");
      setMyFiles(sorted);
    } catch (e) {
      setAlert({
        message: "Failed to fetch files.",
        type: "error",
        visible: true,
      });
    }
  }, [SelectedFileId, setMyFiles, setAlert]);

  const getOfflineData = useCallback(async () => {
    const key =
      SelectedFileId.length > 0
        ? SelectedFileId[SelectedFileId.length - 1]
        : "root";

    const data = (await getItem(key.toString())) as FileItem[] | null;
    return data;
  }, [SelectedFileId]);

  useEffect(() => {
    const loadData = async () => {
      const offlineData = await getOfflineData();

      if (offlineData && offlineData.length > 0) {
        // 🔹 Offline data mil gaya → use karo
        const sorted = sortFiles(offlineData, "name");
        setMyFiles(sorted);
        console.log("📦 Loaded from local cache");
      } else {
        // 🔹 Offline data nahi mila → online fetch karo
        console.log("🌐 Fetching from API...");
        await getData();
      }
    };

    loadData();
  }, [getOfflineData, getData]);
}

export const sortFiles = (filesArray: FileItem[], type: string): FileItem[] => {
  const sorted = [...filesArray].sort((a, b) => {
    if (a.is_folder && !b.is_folder) return -1;
    if (!a.is_folder && b.is_folder) return 1;

    if (type === "name") return a.name.localeCompare(b.name);
    if (type === "size")
      return parseInt(a.size || "0") - parseInt(b.size || "0");
    if (type === "date") {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });
  return sorted;
};
