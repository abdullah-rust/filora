// src/components/Header/Header.tsx

import React, { useState } from "react";
import styles from "./Header.module.css";
import UploadComp from "../upload/uploadComp";
// Logo ko import karne ke liye, use public/assets/ ya is tarah ki directory mein daal dijiye
// Abhi ke liye hum sirf text istemal karain ge, lekin aap yahan image import kar sakte hain

const Header: React.FC = () => {
  const [upload, setUpload] = useState(false);

  function close() {
    setUpload(false);
  }

  function open() {
    setUpload(true);
  }

  return (
    <div>
      <header className={styles.header}>
        {/* 1. Logo aur Brand Name */}
        <div className={styles.logoArea}>
          {/* Yahan aap ka uploaded logo image aayega, abhi ke liye main gradient text use kar raha hoon */}
          <h1 className={styles.logoText}>FILORA</h1>
        </div>

        {/* 2. Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search files and folders..."
            className={styles.searchInput}
          />
        </div>

        {/* 3. Actions (Upload aur Profile) */}
        <div className={styles.actions}>
          <button className={styles.uploadButton} onClick={open}>
            {/* Plus Icon yahan aayega */}+ Upload
          </button>
        </div>
      </header>
      {upload ? <UploadComp onClose={close} /> : ""}
    </div>
  );
};

export default Header;
