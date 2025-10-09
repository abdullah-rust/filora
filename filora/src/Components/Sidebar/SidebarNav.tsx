// src/components/Sidebar/SidebarNav.tsx
import React from "react";
import styles from "./Sidebar.module.css";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "../../states/States";
import { currentViewAtom } from "../../states/States";
import type { AppView } from "../../states/States";
import { useWindowSize } from "../../states/help";

interface NavLinkProps {
  label: string;
  icon: string;
  viewName: AppView;
  isActive: boolean;
  onNavClick: (view: AppView) => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  icon,
  isActive,
  viewName,
  onNavClick,
}) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onNavClick(viewName);
    }}
    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
  >
    <span className={styles.icon}>{icon}</span>
    {label}
  </a>
);

const SidebarNav: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarOpenAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const { width } = useWindowSize();

  const handleNavigation = (view: AppView) => {
    setCurrentView(view);

    if (width < 500 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <nav>
      {[
        { label: "My Files", icon: "📁", view: "MyFiles" },
        { label: "Settings", icon: "⚙️", view: "Settings" },
      ].map((item) => (
        <NavLink
          key={item.view}
          label={item.label}
          icon={item.icon}
          viewName={item.view as AppView}
          isActive={currentView === item.view}
          onNavClick={handleNavigation}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;
