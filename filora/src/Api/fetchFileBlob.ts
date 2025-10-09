// src/utils/fetchFileBlob.ts
import { api } from "../global/api";

/**
 * Fetch file blob from server and return both blob and blobUrl.
 * This function centralizes file fetching logic.
 */
export async function fetchFileBlob(fileUUID: string, mimeType: string) {
  try {
    const response = await api.get(`/file/${fileUUID}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    return { blob, blobUrl };
  } catch (error) {
    console.error("❌ Failed to fetch file blob:", error);
    throw new Error("Failed to load file. Try again later.");
  }
}
