import { Request, Response } from "express";
import { uploadFileToMinio } from "../../utils/minioUpload";
import { v4 as uuidv4 } from "uuid";
import redis from "../../clients/redisClient";
import pool from "../../clients/pg";

export default async function Upload(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = (req as any).user?.id;

    if (!userId) {
      // Agar yahan userId nahi mila, to JWT middleware theek se nahi chala.
      // Hamen isay 401 de kar rok dena chahiye.
      return res
        .status(401)
        .json({ message: "Unauthorised: User ID not found." });
    }
    if (!files || files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    // Folder handling
    const folderName = (req as any).body.foldername?.trim();
    let folderId: number | null = null;

    if (folderName) {
      // Check if folder already exists for user
      const folderResult = await pool.query(
        `SELECT id FROM folders WHERE owner_id=$1 AND name=$2 LIMIT 1`,
        [userId, folderName]
      );
      if (folderResult.rowCount !== 0) {
        folderId = folderResult.rows[0].id;
      } else {
        // Create folder if not exists
        const insertFolder = await pool.query(
          `INSERT INTO folders (name, owner_id) VALUES ($1,$2) RETURNING id`,
          [folderName, userId]
        );
        folderId = insertFolder.rows[0].id;
      }
    }

    const results: { uuid: string; minioKey: string }[] = [];

    for (const file of files) {
      // 1️⃣ Generate UUID for DB / Redis
      const fileUUID = uuidv4();

      // 2️⃣ Upload to MinIO
      const minioKey = await uploadFileToMinio(file.buffer, file.originalname);

      // 3️⃣ Store in Redis
      await redis.set(`file:${fileUUID}`, minioKey);

      // 4️⃣ Insert into files table
      await pool.query(
        `INSERT INTO files
          (name, storage_key, size, mime_type, owner_id, folder_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          file.originalname,
          fileUUID,
          file.size,
          file.mimetype,
          userId,
          folderId,
        ]
      );

      results.push({ uuid: fileUUID, minioKey });
    }

    return res.json({ uploaded: results });
  } catch (err) {
    console.error("File uploading error:", err);
    return res.status(500).json({ message: "Internal Server error" });
  }
}
