import styles from "./Stream.module.css";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { fileStreamAtom } from "../../states/States";
import { fetchFileBlob } from "../../Api/fetchFileBlob";
import {
  getBlobFromCache,
  saveBlobToCache,
} from "../../utils/localForageUtils";

export default function Stream() {
  const [streamData, setStreamData] = useAtom(fileStreamAtom);
  const { fileUUID, fileName, mimeType, visible } = streamData;

  // ✅ Local UI states
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Mime type checks
  const isImage = mimeType?.startsWith("image/") ?? false;
  const isVideo = mimeType?.startsWith("video/") ?? false;
  const requiresDownload = !isImage && !isVideo;

  // ✅ Load file preview (image/video)
  useEffect(() => {
    if (!fileUUID || !mimeType) return;
    if (requiresDownload) {
      setLoading(false);
      return;
    }

    let isActive = true;
    let currentBlobUrl: string | null = null;
    const cacheKey = `preview-${fileUUID}`;

    const loadPreview = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 1️⃣ Try to load from cache first
        const cachedBlob = await getBlobFromCache(cacheKey);

        if (cachedBlob) {
          const cachedUrl = URL.createObjectURL(cachedBlob);
          currentBlobUrl = cachedUrl;
          setBlobUrl(cachedUrl);
          setLoading(false);
          console.log("✅ Showing cached preview");
          return; // 🚀 No need to fetch online
        }

        // 🔹 2️⃣ If not cached → fetch from API
        const { blobUrl, blob } = await fetchFileBlob(fileUUID, mimeType);
        if (!isActive) return;

        currentBlobUrl = blobUrl;
        setBlobUrl(blobUrl);
        setLoading(false);

        // 🔹 3️⃣ Save fetched blob in local cache
        await saveBlobToCache(cacheKey, blob);
      } catch (err: any) {
        console.error("❌ Failed to load preview:", err);
        if (!isActive) return;
        setError(err.message || "Failed to load file. Try again later.");
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      isActive = false;
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    };
  }, [fileUUID, mimeType, requiresDownload]);

  // ✅ Close handler
  const handleClose = () => {
    setStreamData({
      fileUUID: null,
      fileName: null,
      mimeType: null,
      visible: false,
    });
  };

  // ✅ Early return if no file visible
  if (!visible || !fileUUID || !fileName || !mimeType) return null;

  // ✅ Download handler (reuse utility function)
  const handleDownload = async () => {
    try {
      const { blob } = await fetchFileBlob(fileUUID, mimeType);
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // ✅ Dynamic content rendering
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
      <img src={blobUrl} alt={fileName} className={styles.mediaContent} />
    );
  } else if (blobUrl && isVideo) {
    content = (
      <video controls autoPlay className={styles.mediaContent}>
        <source src={blobUrl} type={mimeType} />
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

  // ✅ Final UI render
  return (
    <main className={styles.backdrop} onClick={handleClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
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
