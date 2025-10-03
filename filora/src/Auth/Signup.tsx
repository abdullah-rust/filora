// src/pages/Auth/Signup.tsx

import React, { useState } from "react";
import styles from "./Signup.module.css"; // Common styles ya naya file use karain ge
import AlertMessage from "../components/AlertMessage/AlertMessage";
import { api } from "../global/api";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  // States for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  // States for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
      return;
    }
    e.preventDefault();
    setIsLoading(true); // Loading shuru karo

    try {
      await api.post("/signup", {
        name,
        email,
        password,
      });

      navigate("/otp", { state: { email: email, type: "signup" } });
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
        <div className={styles.signupBox}>
          <div className={styles.logo}>FILORA</div>
          <h1 className={styles.title}>Create Your Filora Account</h1>

          <form onSubmit={handleSignup} className={styles.form}>
            {/* Name Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {/* Email Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {/* Password Input with Toggle */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input with Toggle */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className={styles.passwordToggle}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.signupBtn}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className={styles.footerLink}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
