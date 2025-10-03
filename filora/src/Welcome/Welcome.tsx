// src/pages/Welcome/Welcome.tsx

import React, { useEffect, useState } from "react";
import styles from "./Welcome.module.css";
import { useNavigate } from "react-router-dom";
import Logo from "/header_logo.png";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const check = localStorage.getItem("is_login");

    if (!check) {
      setLogin(true);
    } else {
      navigate("/", { replace: true });
    }
  });

  if (!login) {
    return "";
  }

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.contentBox}>
        {/* Logo Area (Hum yahan text use kar rahe hain, lekin aap image laga sakte hain) */}
        <div className={styles.logo}>
          {/* Aap ka banaya hua Filora Logo yahan aayega */}
          <img src={Logo} alt="Filora" className={styles.img} />
        </div>

        {/* Project Description - Mazedaar Content */}
        <h1 className={styles.tagline}>
          Your Cloud, Your Rules.
          <br /> Securely Store, Share, and Access Anytime.
        </h1>
        <br />
        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.btn} ${styles.primaryBtn}`}
            onClick={() => navigate("/signup")}
          >
            🚀 Get Started (Signup)
          </button>
          <button
            className={`${styles.btn} ${styles.secondaryBtn}`}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
