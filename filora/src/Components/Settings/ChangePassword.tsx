import React, { useState } from "react";
import { useAtom } from "jotai";
import { changePasswordModalVisibleAtom } from "../../states/States";
import { useSettingsActions } from "../../Api/useSettingsActions";
import styles from "./SettingsModals.module.css";

export default function ChangePasswordModal() {
  const [visible, setVisible] = useAtom(changePasswordModalVisibleAtom);
  const { changePassword } = useSettingsActions();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    // Reset state when closing
    setOldPassword("");
    setNewPassword("");
    setError("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword) {
      setError("Please fill out all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (oldPassword === newPassword) {
      setError("New password must be different from the old password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      handleClose(); // Close on success
    } catch (err) {
      // Error handled by hook's alert
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = oldPassword.length > 0 && newPassword.length >= 8;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <h2 className={styles.header}>Change Your Password</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="oldPassword">
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              className={styles.input}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="newPassword">
              New Password (Min 8 characters)
            </label>
            <input
              id="newPassword"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !isFormValid}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
