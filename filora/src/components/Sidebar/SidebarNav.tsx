// src/components/Sidebar/SidebarNav.tsx (UPDATED)

import React from "react";
import styles from "./Sidebar.module.css";

// Nav Options Typescript ke liye (optional, lekin accha hai)
type CurrentView = "MyFiles" | "Shared" | "Trash" | "Settings";

interface NavLinkProps {
  label: string;
  icon: string;
  isActive: boolean;
  viewName: CurrentView; // Naya prop to identify the view
  onNavClick: (view: CurrentView) => void; // Naya prop to handle the click
}

// NavLink ab 'href' use nahi karega, balke 'onClick' use karega
const NavLink: React.FC<NavLinkProps> = ({
  label,
  icon,
  isActive,
  viewName,
  onNavClick,
}) => (
  <a
    href="#" // Route change rokne ke liye
    onClick={(e) => {
      e.preventDefault();
      onNavClick(viewName);
    }}
    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
  >
    <span className={styles.icon}>{icon}</span> {/* Icon Placeholder */}
    {label}
  </a>
);

interface SidebarNavProps {
  onNavClick: (view: CurrentView) => void;
  currentActiveView: CurrentView;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  onNavClick,
  currentActiveView,
}) => {
  return (
    <nav>
      <NavLink
        label="My Files"
        icon="📁"
        viewName="MyFiles"
        isActive={currentActiveView === "MyFiles"}
        onNavClick={onNavClick}
      />
      <NavLink
        label="Shared"
        icon="👥"
        viewName="Shared"
        isActive={currentActiveView === "Shared"}
        onNavClick={onNavClick}
      />
      <NavLink
        label="Trash"
        icon="🗑️"
        viewName="Trash"
        isActive={currentActiveView === "Trash"}
        onNavClick={onNavClick}
      />
      <NavLink
        label="Settings"
        icon="⚙️"
        viewName="Settings"
        isActive={currentActiveView === "Settings"}
        onNavClick={onNavClick}
      />
    </nav>
  );
};

export default SidebarNav;
