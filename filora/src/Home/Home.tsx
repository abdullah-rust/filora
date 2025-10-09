import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";
import { MyFiles } from "../pages/MyFiles/MyFiles";

import Settings from "../pages/Settings/Settings";
import { useAtom } from "jotai";
import {
  sidebarOpenAtom,
  currentViewAtom,
  uploadModalAtom,
  createFolderModalAtom,
  fileOptionsVisibleAtom,
} from "../states/States";
import styles from "./Home.module.css";
import { useWindowSize } from "../states/help";
import { useEffect } from "react";
import Stream from "../pages/Stream/Stream";
import UploadComp from "../Components/upload/uploadComp";
import useAuthRedirect from "../hooks/useAuthRedirect";
import CreateFolder from "../Components/upload/CreateFolder";
import FileOptionsModal from "../Components/Option/OptionComo";

export default function Home() {
  const [isSidebarOpen, setIsSideBarOpen] = useAtom(sidebarOpenAtom);
  const [currentView] = useAtom(currentViewAtom);
  const { width } = useWindowSize();
  const [uploadModal] = useAtom(uploadModalAtom);
  const [createFolderModal] = useAtom(createFolderModalAtom);
  const [fileOptionsVisible] = useAtom(fileOptionsVisibleAtom);

  useEffect(() => {
    if (width >= 500) {
      setIsSideBarOpen(true);
    }
  }, [width]);

  useAuthRedirect();

  const renderContent = () => {
    switch (currentView) {
      case "MyFiles":
        return <MyFiles />;
      case "Settings":
        return <Settings />;
      default:
        return <MyFiles />;
    }
  };

  return (
    <main>
      <Header />

      <div className={styles.mainContentFlex}>
        {/* Sidebar global state se auto control hoti hai */}
        {isSidebarOpen && <Sidebar />}

        {/* Dynamic Content Area */}
        <main className={styles.contentArea}>{renderContent()}</main>
      </div>

      <Stream />
      {uploadModal && <UploadComp />}
      {createFolderModal && <CreateFolder />}
      {fileOptionsVisible && <FileOptionsModal />}
    </main>
  );
}
