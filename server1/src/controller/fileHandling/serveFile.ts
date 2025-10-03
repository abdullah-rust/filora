// src/controllers/file/StreamFile.ts
import { Request, Response } from "express";
import redis from "../../clients/redisClient";
import { minioClient } from "../../clients/minio";
import pool from "../../clients/pg";

export default async function StreamFile(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const fileUUID = req.params["uuid"];
    const userId = (req as any).user?.id;

    console.log("📨 Stream request for UUID:", fileUUID, "User:", userId);

    if (!fileUUID) {
      return res.status(400).json({ message: "File UUID is required" });
    }

    // 1️⃣ Redis cache se MinIO key fetch
    let minioKey = await redis.get(`file:${fileUUID}`);

    // Agar Redis me na ho to DB se check karo
    if (!minioKey) {
      console.log("🔍 Redis miss, checking DB...");
      const dbCheck = await pool.query(
        `SELECT storage_key FROM files WHERE storage_key=$1 LIMIT 1`,
        [fileUUID]
      );

      if (dbCheck.rowCount === 0) {
        console.log("❌ File not found in DB");
        return res.status(404).json({ message: "File not found" });
      }

      minioKey = dbCheck.rows[0].storage_key;
      console.log("✅ Found in DB, MinIO Key:", minioKey);

      // Redis me cache store karo
      await redis.set(`file:${fileUUID}`, minioKey || "");
    } else {
      console.log("✅ Found in Redis, MinIO Key:", minioKey);
    }

    // 2️⃣ Metadata fetch karo
    const fileResult = await pool.query(
      `SELECT name, mime_type, owner_id, size 
       FROM files WHERE storage_key=$1 LIMIT 1`,
      [fileUUID]
    );

    if (fileResult.rowCount === 0) {
      console.log("❌ File metadata not found");
      return res.status(404).json({ message: "File metadata not found" });
    }

    const file = fileResult.rows[0];
    console.log("📄 File metadata:", file);

    // ✅ Ownership check
    if (file.owner_id !== userId) {
      console.log("❌ Access denied - User ID mismatch");
      return res.status(403).json({ message: "Access denied" });
    }

    // 3️⃣ MinIO se file existence check
    try {
      await minioClient.statObject("filorafiles", minioKey || "");
      console.log("✅ File exists in MinIO");
    } catch (err) {
      console.error("❌ File not found in MinIO:", err);
      return res.status(404).json({ message: "File not found in storage" });
    }

    // 4️⃣ Response headers set karo
    const mimeType = file.mime_type || "application/octet-stream";
    console.log("📋 Setting MIME type:", mimeType);

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", file.size || "unknown");

    if (mimeType.startsWith("image/") || mimeType.startsWith("video/")) {
      // 🔥 Inline preview for images/videos
      res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    } else {
      // 📥 Download for other files
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      );
    }

    // 5️⃣ File stream MinIO se

    const objectStream = await minioClient.getObject(
      "filorafiles",
      minioKey || ""
    );

    objectStream.on("error", (err) => {
      console.error("❌ Stream error:", err);
    });

    // Stream ko response mein pipe karo
    objectStream.pipe(res);

    // 6️⃣ Last accessed update (background mein)
    pool
      .query(`UPDATE files SET last_accessed=NOW() WHERE storage_key=$1`, [
        fileUUID,
      ])
      .then(() => console.log("✅ Last accessed updated"))
      .catch((err) => console.error("❌ DB update error:", err));
  } catch (err) {
    console.error("💥 Streaming error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
