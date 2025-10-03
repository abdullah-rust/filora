// src/pages/Settings/Settings.tsx

import React, { useState } from "react";
import styles from "./Settings.module.css";

type SettingsView = "Profile" | "Security" | "Billing";

// Sub-component: Placeholder for Profile View
const ProfileSettings: React.FC = () => (
  <div className={styles.settingBlock}>
    <h2>👤 Profile Information</h2>
    <p>Name: Ali Khan</p>
    <p>Email: user@filora.com</p>
    <button className={styles.saveBtn}>Edit Profile</button>
  </div>
);

// Sub-component: Placeholder for Security View
const SecuritySettings: React.FC = () => (
  <div className={styles.settingBlock}>
    <h2>🔒 Security & Access</h2>
    <p>Password last changed: 2 months ago</p>
    <p>
      Two-Factor Authentication:{" "}
      <span className={styles.enabledStatus}>Enabled</span>
    </p>
    <button className={styles.saveBtn}>Change Password</button>
  </div>
);

// Sub-component: Placeholder for Billing View
const BillingSettings: React.FC = () => (
  <div className={styles.settingBlock}>
    <h2>💳 Billing & Storage Plan</h2>
    <p>Current Plan: Pro (50 GB)</p>
    <p>Next Bill Date: 2025-10-30</p>
    <button className={styles.saveBtn}>Upgrade Plan</button>
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
    </div>
  );
};

export default Settings;
