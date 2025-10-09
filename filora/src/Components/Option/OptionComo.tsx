import React from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  fileOptionsVisibleAtom,
  fileOptionsItemNameAtom,
  fileOptionsItemId,
  itemTypeOption,
  copyLinkUUid,
  isPublicOptionAtom,
  alertAtom,
} from "../../states/States";
import styles from "./FileOptionsModal.module.css";
import { useFileActions } from "../../Api/files";

export default function FileOptionsModal() {
  const [visible, setVisible] = useAtom(fileOptionsVisibleAtom);
  const [itemName] = useAtom(fileOptionsItemNameAtom);
  const [itemId] = useAtom(fileOptionsItemId);
  const [ItemOption] = useAtom(itemTypeOption); // 'file' or 'folder'
  const { deleteItem, makePublic, makePrivate } = useFileActions();
  const [link] = useAtom(copyLinkUUid); // Link (UUID) for copying
  const [is_public] = useAtom(isPublicOptionAtom); // Current item ki public state
  const setAlert = useSetAtom(alertAtom); // Alert setter

  if (!visible) return null;

  const handleClose = () => setVisible(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // --- Handlers ---
  async function handlePublic() {
    await makePublic(itemId, ItemOption);
    handleClose();
  }

  async function handlePrivate() {
    await makePrivate(itemId, ItemOption);
    handleClose();
  }

  async function handleDelete() {
    await deleteItem(itemId, ItemOption);
    handleClose();
  }

  function handleCopyLink() {
    if (!link) {
      setAlert({
        message: "Error: Link not available.",
        type: "error",
        visible: true,
      });
      return;
    }
    // Clipboard API ko use karna
    try {
      const BaseUrl = import.meta.env.VITE_URL;

      navigator.clipboard
        .writeText(BaseUrl + link)
        .then(() => {
          setAlert({
            message: "Public link copied to clipboard!",
            type: "success",
            visible: true,
          });
        })
        .catch(() => {
          // Fallback for older browsers/environments
          const textarea = document.createElement("textarea");
          textarea.value = link;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setAlert({
            message: "Public link copied to clipboard!",
            type: "success",
            visible: true,
          });
        });
    } catch (error) {
      setAlert({
        message: "Failed to copy link.",
        type: "error",
        visible: true,
      });
    }
    handleClose();
  }

  // --- Conditional Rendering Logic ---
  const isFolder = ItemOption === "folder";
  const isFile = ItemOption === "file";

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>

        <div className={styles.itemInfo}>
          <span className={styles.itemType}>
            {isFolder ? "Folder" : "File"} Options
          </span>
          <span className={styles.itemName}>{itemName}</span>
        </div>

        <div className={styles.actionGroup}>
          {/* 1. FILE SPECIFIC ACTIONS (Public/Private/Copy Link) */}
          {isFile && (
            <>
              {is_public ? (
                <>
                  {/* Public File: Show Copy Link and Make Private */}
                  <button
                    className={`${styles.actionButton} ${styles.shareButton}`}
                    onClick={handleCopyLink}
                  >
                    🔗 Copy Public Link
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.privateButton}`}
                    onClick={handlePrivate}
                  >
                    🔒 Set to Private
                  </button>
                </>
              ) : (
                // Private File: Show Make Public
                <button
                  className={`${styles.actionButton} ${styles.shareButton}`}
                  onClick={handlePublic}
                >
                  👥 Set to Public
                </button>
              )}
            </>
          )}

          {/* 2. DELETE ACTION (Sab ke liye) */}
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            🗑️ Delete {isFolder ? "Folder" : "File"}
          </button>
        </div>
      </div>
    </div>
  );
}
