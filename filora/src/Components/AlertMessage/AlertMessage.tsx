import { useEffect } from "react";
import { useAtom } from "jotai";
import { alertAtom } from "../../states/States";
import styles from "./AlertMessage.module.css";

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

export default function AlertMessage() {
  const [alert, setAlert] = useAtom(alertAtom);

  useEffect(() => {
    if (!alert.visible) return;

    const timer = setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert.visible, setAlert]);

  if (!alert.visible) return null;

  return (
    <div className={`${styles.alertContainer} ${styles[alert.type]}`}>
      <span className={styles.icon}>{getIcon(alert.type)}</span>
      <p className={styles.message}>{alert.message}</p>
    </div>
  );
}
