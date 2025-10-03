// src/pages/Auth/OTPVerification.tsx

import React, { useState, useRef, createRef, useEffect } from "react";
import styles from "./OTPVerification.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../global/api";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const OTPVerification: React.FC = () => {
  // 6 digit OTP ke liye state
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  // Har input field ko reference karne ke liye refs ka array
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>( // 👈 FIX YAHAN HAI
    otp.map(() => createRef<HTMLInputElement>())
  );
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    // Agar state empty hai, to login par bhej do
    if (!state || Object.keys(state).length === 0) {
      // Agar state object hai lekin empty hai, tab bhi redirect ho.
      navigate("/login", { replace: true }); // 'replace: true' se history clean rahegi
    }
    // 'location' ko nikal do, sirf 'state' aur 'navigate' zaroori hain.
  }, [state, navigate]);
  const handleChange = (element: HTMLInputElement, index: number) => {
    // Sirf digits hi allowed hain
    const value = element.value.replace(/[^0-9]/g, "");

    if (value.length > 1) return; // Agar user paste kare to sirf pehla char lo

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Backspace press karne par previous field par focus
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    try {
      if (finalOtp.length !== 6) {
        setAlert({
          message: "Please enter the complete 6-digit code.",
          type: "error",
        });
        return;
      }

      await api.post("/otp", {
        email: state.email,
        code: finalOtp.toString(),
        typesubmit: state.type,
      });

      localStorage.setItem("is_login", "true");
      navigate("/", { replace: true });
    } catch (err: any) {
      setAlert({
        message: err.response.data.message || err.response.data.error,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAlertClose = () => {
    setAlert(null);
  };

  return (
    <div>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}
      <div className={styles.authContainer}>
        <div className={styles.otpBox}>
          <div className={styles.logo}>FILORA</div>
          <h1 className={styles.title}>Enter Verification Code</h1>
          <p className={styles.infoText}>
            We have sent a 6-digit code to your email ({state.email}).
          </p>

          <form onSubmit={handleVerify} className={styles.form}>
            <div className={styles.otpInputGroup}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={inputRefs.current[index]}
                  className={styles.otpInput}
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  onChange={(e) =>
                    handleChange(e.target as HTMLInputElement, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button type="submit" className={styles.verifyBtn}>
              {isLoading ? "verifyng..." : "Verify & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
