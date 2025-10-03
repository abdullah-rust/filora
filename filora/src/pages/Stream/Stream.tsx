// src/components/FileBrowser/Stream.tsx
import styles from "./Stream.module.css";
import { useState, useEffect } from "react";
import { api } from "../../global/api";

interface Prop {
  fileUUID: string;
  fileName: string;
  mimeType: string;
  onClose: () => void;
}

export default function Stream({
  fileUUID,
  fileName,
  mimeType,
  onClose,
}: Prop) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");
  const requiresDownload = !isImage && !isVideo;

  // 🚀 Preview fetch effect
  useEffect(() => {
    if (requiresDownload) {
      setLoading(false);
      return;
    }

    let isActive = true;
    let currentBlobUrl: string | null = null;

    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/file/${fileUUID}`, {
          responseType: "blob",
        });

        if (!isActive) return;

        // Blob create karo
        const blob = new Blob([response.data], { type: mimeType });
        currentBlobUrl = URL.createObjectURL(blob);

        setBlobUrl(currentBlobUrl);
        setLoading(false);
      } catch (err: any) {
        console.error("❌ Preview fetch failed:", err);
        if (!isActive) return;

        setError(err.response?.data?.message || "Failed to load preview");
        setLoading(false);
      }
    };

    fetchPreview();

    // Cleanup function
    return () => {
      isActive = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [fileUUID, mimeType, requiresDownload]);

  // 📥 Download handler
  const handleDownload = async () => {
    try {
      const response = await api.get(`/file/${fileUUID}`, {
        responseType: "blob",
      });

      // Download link create karo
      const downloadUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: mimeType })
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // 🎨 Content render
  let content;

  if (loading) {
    content = (
      <div className={styles.loading}>
        <div>🔄 Loading preview...</div>
        <small>File: {fileName}</small>
      </div>
    );
  } else if (error) {
    content = (
      <div className={styles.error}>
        <h3>⚠️ Preview Error</h3>
        <p>{error}</p>
        <button className={styles.downloadButton} onClick={handleDownload}>
          Download Instead 📥
        </button>
      </div>
    );
  } else if (blobUrl && isImage) {
    content = (
      <img
        src={blobUrl}
        alt={fileName}
        className={styles.mediaContent}
        onError={(e) => {
          console.error("❌ Image failed to load", e);
          setError("Failed to load image");
        }}
      />
    );
  } else if (blobUrl && isVideo) {
    content = (
      <video
        controls
        className={styles.mediaContent}
        autoPlay
        onError={(e) => {
          console.error("❌ Video failed to load", e);
          setError("Failed to load video");
        }}
      >
        <source src={blobUrl} type={mimeType} />
        Your browser doesn't support the video tag.
      </video>
    );
  } else if (requiresDownload) {
    content = (
      <div className={styles.downloadPrompt}>
        <h3>📄 {fileName}</h3>
        <p>This file type cannot be previewed.</p>
        <button className={styles.downloadButton} onClick={handleDownload}>
          Download File 📥
        </button>
      </div>
    );
  }

  return (
    <main className={styles.backdrop} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.header}>
          <h4>{fileName}</h4>
          <small>Type: {mimeType}</small>
        </div>

        <div className={styles.contentArea}>{content}</div>

        {(isImage || isVideo) && blobUrl && !loading && !error && (
          <div className={styles.footer}>
            <button
              className={styles.downloadButtonSmall}
              onClick={handleDownload}
            >
              Download Original 💾
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
