import React, { useState } from "react";
import styles from "./Login.module.css";
import { api } from "../global/api";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage/AlertMessage";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Loading shuru karo

    try {
      await api.post("/login", {
        email,
        password,
      });
      navigate("/otp", { state: { email: email, type: "login" } });
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
        <div className={styles.loginBox}>
          <div className={styles.logo}>FILORA</div>
          <h1 className={styles.title}>Log In to Your Account</h1>

          <form onSubmit={handleLogin} className={styles.form}>
            {/* ... Email Input ... */}
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
                disabled={isLoading} // Loading mein disable
              />
            </div>

            {/* ... Password Input with Toggle ... */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                  disabled={isLoading} // Loading mein disable
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={styles.passwordToggle}
                  disabled={isLoading} // Loading mein disable
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* 🚀 Submit Button (Loading State) */}
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={isLoading} // Button disable kiya
            >
              {isLoading ? "Loging In..." : "Log In"}
            </button>
          </form>

          <p className={styles.footerLink}>
            Don't have an account?{" "}
            <a href="/signup" className={styles.link}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
