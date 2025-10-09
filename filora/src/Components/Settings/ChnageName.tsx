import React, { useState } from "react";
import { useAtom } from "jotai";
import { changeNameModalVisibleAtom } from "../../states/States";
import { useSettingsActions } from "../../Api/useSettingsActions";
import styles from "./SettingsModals.module.css";

export default function ChangeNameModal() {
  const [visible, setVisible] = useAtom(changeNameModalVisibleAtom);
  const currentName = "";
  const { changeName } = useSettingsActions();

  const [newName, setNewName] = useState(currentName || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    // Reset state when closing
    setNewName(currentName || "");
    setError("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newName.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (newName.trim() === currentName) {
      setError("New name must be different from current name.");
      return;
    }

    setLoading(true);
    try {
      await changeName(newName);
      handleClose(); // Close on success
    } catch (err) {
      // Error handled by hook's alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <h2 className={styles.header}>Edit Profile Name</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="newName">
              New Name
            </label>
            <input
              id="newName"
              type="text"
              className={styles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your new name"
              disabled={loading}
              maxLength={50}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || newName.trim().length < 2}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
