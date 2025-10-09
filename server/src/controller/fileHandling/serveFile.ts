import { Request, Response } from "express";
import { minioClient } from "../../clients/minio";
import pool from "../../clients/pg";

export default async function StreamFile(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const fileUUID = req.params["uuid"];
    const userId = (req as any).user?.id;

    if (!fileUUID) {
      return res.status(400).json({ message: "File UUID is required" });
    }

    // 1️⃣ File metadata + MinIO key fetch directly from Postgres
    const fileResult = await pool.query(
      `SELECT name, mime_type, owner_id, size, storage_key 
       FROM files WHERE uuid = $1 LIMIT 1`,
      [fileUUID]
    );

    if (fileResult.rowCount === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = fileResult.rows[0];

    // ✅ Ownership check (ensure user owns it)
    if (file.owner_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 2️⃣ MinIO se file existence check
    try {
      await minioClient.statObject("filorafiles", file.storage_key);
    } catch (err) {
      console.error("❌ File not found in MinIO:", err);
      return res.status(404).json({ message: "File not found in storage" });
    }

    // 3️⃣ Response headers set karo
    const mimeType = file.mime_type || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", file.size || "unknown");

    if (mimeType.startsWith("image/") || mimeType.startsWith("video/")) {
      res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    } else {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      );
    }

    // 4️⃣ File stream MinIO se
    const objectStream = await minioClient.getObject(
      "filorafiles",
      file.storage_key
    );

    objectStream.on("error", (err) => {
      console.error("❌ Stream error:", err);
    });

    objectStream.pipe(res);

    pool
      .query(`UPDATE files SET last_accessed = NOW() WHERE uuid = $1`, [
        fileUUID,
      ])
      .then(() => {})
      .catch((err) => console.error("❌ DB update error:", err));
  } catch (err) {
    console.error("💥 Streaming error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
