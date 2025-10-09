import { api } from "../global/api";
import { useSetAtom } from "jotai";
import { alertAtom } from "../states/States"; // Assuming alertAtom and userNameAtom are defined
import { setItem } from "../utils/localForageUtils";

/**
 * useSettingsActions()
 * Handles API calls for user settings changes (Name, Password)
 * with Jotai state and alert synchronization.
 */
export function useSettingsActions() {
  const setAlert = useSetAtom(alertAtom);

  /** 🔄 Change User Name */
  const changeName = async (newName: string) => {
    try {
      // API Call: Using the assumed endpoint /settings/change-name
      const res = await api.post("/change-username", {
        newName: newName.trim(),
      });

      // Local Cache Update (Good practice)
      await setItem("user_name", newName.trim());

      setAlert({
        message: res.data.message || "Name updated successfully.",
        type: "success",
        visible: true,
      });

      return res.data;
    } catch (err: any) {
      console.error("❌ ChangeName error:", err.response?.data || err.message);
      setAlert({
        message: err.response?.data?.message || "Failed to update name.",
        type: "error",
        visible: true,
      });
      throw err;
    }
  };

  /** 🔑 Change User Password */
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      // API Call: Using the assumed endpoint /settings/change-password
      const res = await api.post("/change-password", {
        oldPassword,
        newPassword,
      });

      setAlert({
        message:
          res.data.message || "Password changed successfully. Please re-login.",
        type: "success",
        visible: true,
      });

      return res.data;
    } catch (err: any) {
      console.error(
        "❌ ChangePassword error:",
        err.response?.data || err.message
      );
      setAlert({
        message: err.response?.data?.message || "Failed to change password.",
        type: "error",
        visible: true,
      });
      throw err;
    }
  };

  return { changeName, changePassword };
}
