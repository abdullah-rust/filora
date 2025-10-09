// src/pages/Welcome/Welcome.tsx
import React, { useEffect, useState } from "react";
import styles from "./Welcome.module.css";
import { useNavigate } from "react-router-dom";
import Logo from "/header_logo.png";
import localforage from "localforage";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // ✅ for smooth render

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const check = await localforage.getItem("is_login");

        if (check) {
          // ✅ Agar already logged in hai → Home page bhej do
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Error checking login:", err);
      } finally {
        setLoading(false); // ✅ render only after check
      }
    };

    checkLogin();
  }, [navigate]);

  if (loading) return null; // Ya spinner bhi laga sakta hai tu

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.contentBox}>
        {/* ✅ Logo */}
        <div className={styles.logo}>
          <img src={Logo} alt="Filora" className={styles.img} />
        </div>

        {/* ✅ Tagline */}
        <h1 className={styles.tagline}>
          Your Cloud, Your Rules.
          <br /> Securely Store, Share, and Access Anytime.
        </h1>

        {/* ✅ Buttons */}
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
