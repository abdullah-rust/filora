// src/states/myFileAtoms.ts

import { atom } from "jotai";
import type { FileItem, AlertData } from "../Types/Types";

/* ────────────────────────────────
   📁 FILES & FOLDERS STATE
──────────────────────────────── */
export const filesAtom = atom<FileItem[]>([]); // All files/folders in current view
export const selectedFolderIdsAtom = atom<number[]>([]); // IDs of selected folders
export const currentFolderPathAtom = atom<string[]>(["Home", "MyFiles"]); // Folder navigation breadcrumb

/* ────────────────────────────────
   📤 UPLOAD & CREATE FOLDER MODALS
──────────────────────────────── */
export const uploadModalAtom = atom<boolean>(false); // Upload modal visibility
export const createFolderModalAtom = atom<boolean>(false); // Create folder modal visibility
export const createFolderParentNameAtom = atom<string>("Root"); // Parent folder name for new folder

/* ────────────────────────────────
   ⚙️ FILE OPTIONS (Right-click / Menu)
──────────────────────────────── */
export const fileOptionsVisibleAtom = atom<boolean>(false); // Show/hide file options modal
export const fileOptionsItemNameAtom = atom<string>(""); // Selected item name
export const fileOptionsItemId = atom<number>(0); // Whether the selected item is a folder
export const itemTypeOption = atom<string>("");
export const copyLinkUUid = atom<string>("");
export const isPublicOptionAtom = atom<boolean>(false);

/* ────────────────────────────────
   🧭 SIDEBAR & CURRENT VIEW STATE
──────────────────────────────── */
export type AppView = "MyFiles" | "Shared" | "Trash" | "Settings";
export const currentViewAtom = atom<AppView>("MyFiles"); // Active sidebar tab
export const sidebarOpenAtom = atom<boolean>(false); // Sidebar toggle (open/close)

/* ────────────────────────────────
   📡 STREAMING (Preview File)
──────────────────────────────── */
export const fileStreamAtom = atom<{
  fileUUID: string | null;
  fileName: string | null;
  mimeType: string | null;
  visible: boolean;
}>({
  fileUUID: null,
  fileName: null,
  mimeType: null,
  visible: false,
});

/* ────────────────────────────────
   ⚠️ ALERT / NOTIFICATION SYSTEM
──────────────────────────────── */
export const alertAtom = atom<AlertData>({
  message: "",
  type: "info",
  visible: false,
});

/* ────────────────────────────────
   ⚙ SETTINS / UPDATING
──────────────────────────────── */
export const changeNameModalVisibleAtom = atom(false);
export const changePasswordModalVisibleAtom = atom(false);
