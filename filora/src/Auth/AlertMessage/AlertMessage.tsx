import { useState, useEffect } from "react";
import styles from "./AlertMessage.module.css";

interface AlertMessageProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return "✔️";
    case "error":
      return "❌";
    case "info":
      return "ℹ️";
    default:
      return "💬";
  }
};

export default function AlertMessage({
  message,
  type,
  onClose,
}: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Message ko 5 seconds ke baad auto-hide karein
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Parent component ko batayen ke message hat gaya hai
    }, 5000);

    return () => clearTimeout(timer); // Component unmount hone par timer clear karein
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.alertContainer} ${styles[type]}`}>
      <span className={styles.icon}>{getIcon(type)}</span>
      <p className={styles.message}>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className={styles.closeButton}
      >
        &times;
      </button>
    </div>
  );
}
