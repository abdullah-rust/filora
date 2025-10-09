import { Request, Response } from "express";
import { uploadFileToMinio } from "../../utils/minioUpload";
import { v4 as uuidv4 } from "uuid";
import pool from "../../clients/pg";

export default async function Upload(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = (req as any).user?.id;
    const folderIdParam = req.params["folderId"];

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found." });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const folderId =
      folderIdParam && !isNaN(Number(folderIdParam))
        ? parseInt(folderIdParam)
        : null;

    // ✅ Validate folder ownership (if folderId provided)
    if (folderId !== null) {
      const folderCheck = await pool.query(
        `SELECT id FROM folders WHERE id=$1 AND owner_id=$2 LIMIT 1`,
        [folderId, userId]
      );

      if (folderCheck.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Folder not found or access denied." });
      }
    }

    const uploadedFilesMeta: any[] = [];

    for (const file of files) {
      // ✅ Unique UUID for external access
      const fileUUID = uuidv4();

      // 🔹 Upload file to MinIO
      const minioKey = await uploadFileToMinio(file.buffer, file.originalname);

      // 🔹 Store full info directly in PostgreSQL (no Redis)
      const insertQuery = `
        INSERT INTO files (name, storage_key, size, mime_type, owner_id, folder_id, uuid)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, size, mime_type, folder_id AS parent_id, uuid;
      `;

      const insertRes = await pool.query(insertQuery, [
        file.originalname, // name
        minioKey, // storage key (MinIO object key)
        file.size,
        file.mimetype,
        userId,
        folderId,
        fileUUID, // UUID for public/internal access
      ]);

      const dbFile = insertRes.rows[0];

      uploadedFilesMeta.push({
        id: dbFile.id,
        name: dbFile.name,
        size: dbFile.size,
        mime_type: dbFile.mime_type,
        parent_id: dbFile.parent_id,
        uuid: dbFile.uuid,
        is_folder: false,
      });
    }

    return res.status(200).json({
      message: "Files uploaded successfully!",
      uploaded: uploadedFilesMeta,
    });
  } catch (err) {
    console.error("❌ File uploading error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
