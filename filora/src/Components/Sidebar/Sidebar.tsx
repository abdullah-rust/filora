import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import SidebarNav from "./SidebarNav";
import { api } from "../../global/api";
import { useAtom } from "jotai";
import { currentViewAtom } from "../../states/States";

interface StorageStatus {
  used: number;
  limit: number;
  remaining: number;
  percent: number;
}

const Sidebar: React.FC = () => {
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [currentView] = useAtom(currentViewAtom);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await api.get("/storage-status");
        const data = res.data;

        const fixedData: StorageStatus = {
          used: Number(data.used),
          limit: Number(data.limit),
          remaining: Number(data.remaining),
          percent: Number(data.percent), // 👈 already % from backend
        };

        setStorage(fixedData);
      } catch (err) {
        console.error("❌ Storage fetch error:", err);
      }
    };

    fetchStorage();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(2)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  return (
    <div className={styles.sidebar}>
      <SidebarNav />

      <div style={{ marginTop: "auto", padding: "20px" }}>
        {!storage ? (
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            Loading storage...
          </p>
        ) : (
          <>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
              Storage: {formatBytes(storage.used)} of{" "}
              {formatBytes(storage.limit)} used
            </p>
            <div
              style={{
                height: "6px",
                backgroundColor: "#333",
                borderRadius: "5px",
                marginTop: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(storage.percent, 100)}%`,
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(to right, #fb923c, var(--color-primary))",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
