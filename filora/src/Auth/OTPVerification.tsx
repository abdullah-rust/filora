// src/pages/Auth/OTPVerification.tsx

import React, { useState, useRef, createRef, useEffect } from "react";
import styles from "./OTPVerification.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../global/api";
import AlertMessage from "./AlertMessage/AlertMessage";
import localforage from "localforage";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isChecking, setIsChecking] = useState(true); // 🔹 UI tabhi render hoga jab check complete ho jaye
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>(
    otp.map(() => createRef<HTMLInputElement>())
  );

  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const isLogin = await localforage.getItem("is_login");

        if (isLogin) {
          console.log("✅ Already logged in → redirecting to /");
          navigate("/", { replace: true });
          return;
        }

        if (!state || Object.keys(state).length === 0) {
          console.log("⚠️ No OTP state → redirecting to /login");
          navigate("/login", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Error checking login:", err);
      } finally {
        setIsChecking(false); // ✅ Ab render karne ki permission mil gayi
      }
    };

    init();
  }, [state, navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

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

      setIsLoading(true);
      await api.post("/otp", {
        email: state.email,
        code: finalOtp.toString(),
        typesubmit: state.type,
      });

      await localforage.setItem("is_login", true);
      await localforage.setItem("email", state.email);
      const name = await api.get("/get-username");
      await localforage.setItem("user_name", name.data.name);

      navigate("/", { replace: true });
    } catch (err: any) {
      setAlert({
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Verification failed.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  // 🔸 Jab tak login/OTP check ho raha hai → loading UI dikhao
  if (isChecking) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.otpBox}>
          <h1 className={styles.title}>Checking session...</h1>
          <p className={styles.infoText}>Please wait a moment...</p>
        </div>
      </div>
    );
  }

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
            We have sent a 6-digit code to your email ({state.email || ""}).
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
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
