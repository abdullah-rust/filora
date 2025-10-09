import React, { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { getItem } from "../../utils/localForageUtils";
import { useSetAtom } from "jotai";
import {
  changeNameModalVisibleAtom,
  changePasswordModalVisibleAtom,
} from "../../states/States";
import ChangeNameModal from "../../Components/Settings/ChnageName";
import ChangePasswordModal from "../../Components/Settings/ChangePassword";

type SettingsView = "Profile" | "Security" | "Billing";

// Sub-component: Placeholder for Profile View
const ProfileSettings: React.FC = () => {
  const [email, SetEmail] = useState("");
  const setChangeNameModalVisible = useSetAtom(changeNameModalVisibleAtom); // ✅ Setter for Modal
  const [name, setName] = useState("");
  const fetchEmail = async () => {
    // Ideally, the user's name should be fetched here too if not set on app load
    // For now, fetching email from localForage
    const res = await getItem("email");
    SetEmail(res);
    const res2 = await getItem("user_name");
    setName(res2);
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <div className={styles.settingBlock}>
      <h2>👤 Profile Information</h2>
      <p>Name: {name}</p> {/* ✅ Displaying dynamic name */}
      <p>Email: {email || "Loading..."}</p>
      <button
        className={styles.saveBtn}
        onClick={() => setChangeNameModalVisible(true)} // ✅ Show Change Name Modal
      >
        Edit Profile Name
      </button>
    </div>
  );
};

// Sub-component: Placeholder for Security View
const SecuritySettings: React.FC = () => {
  const setChangePasswordModalVisible = useSetAtom(
    changePasswordModalVisibleAtom
  ); // ✅ Setter for Modal

  return (
    <div className={styles.settingBlock}>
      <h2>🔒 Security & Access</h2>
      <p>Password last changed: 2 months ago</p>
      <p>
        Two-Factor Authentication:{" "}
        <span className={styles.enabledStatus}>Enabled</span>
      </p>
      <button
        className={styles.saveBtn}
        onClick={() => setChangePasswordModalVisible(true)} // ✅ Show Change Password Modal
      >
        Change Password
      </button>
    </div>
  );
};

// Sub-component: Placeholder for Billing View
const BillingSettings: React.FC = () => (
  <div className={styles.settingBlock}>
    <h2>💳 Billing & Storage Plan</h2>
    <p>Current Plan: free (10 GB)</p>
    <p>Next Bill Date: None</p>
    <button className={styles.saveBtn}>Coming soon</button>
  </div>
);

const Settings: React.FC = () => {
  const [currentSettingsView, setCurrentSettingsView] =
    useState<SettingsView>("Profile");

  const renderContent = () => {
    switch (currentSettingsView) {
      case "Profile":
        return <ProfileSettings />;
      case "Security":
        return <SecuritySettings />;
      case "Billing":
        return <BillingSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h1>⚙️ Account Settings</h1>

      <div className={styles.settingsFlex}>
        {/* 1. Settings Sub-Navigation Sidebar */}
        <nav className={styles.settingsNav}>
          {["Profile", "Security", "Billing"].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentSettingsView(view as SettingsView)}
              className={`${styles.navItem} ${
                currentSettingsView === view ? styles.activeNav : ""
              }`}
            >
              {view}
            </button>
          ))}
        </nav>

        {/* 2. Main Settings Content Area */}
        <div className={styles.settingsContent}>{renderContent()}</div>
      </div>

      {/* 3. Modals ko render kiya */}
      <ChangeNameModal />
      <ChangePasswordModal />
    </div>
  );
};

export default Settings;
