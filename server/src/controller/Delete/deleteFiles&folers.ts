import { Request, Response } from "express";
import pool from "../../clients/pg";
import { deleteFileFromMinio } from "../../utils/minioUpload";

export default async function deleteItem(req: Request, res: Response) {
  const { id, type } = req.body;
  const userId = (req as any).user?.id;

  if (!id || !type) {
    return res.status(400).json({ message: "Missing id or type in body" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorised: User not found" });
  }

  try {
    if (type === "file") {
      // 🔹 Get storage_key
      const fileRes = await pool.query(
        `SELECT storage_key FROM files WHERE id=$1 AND owner_id=$2 LIMIT 1`,
        [id, userId]
      );

      if (fileRes.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "File not found or access denied" });
      }

      const key = fileRes.rows[0].storage_key;

      // 🔹 Delete from MinIO
      await deleteFileFromMinio(key);

      // 🔹 Delete from DB
      await pool.query(`DELETE FROM files WHERE id=$1 AND owner_id=$2`, [
        id,
        userId,
      ]);

      return res.status(200).json({ message: "File deleted successfully" });
    }

    // 🔹 If it's a folder
    else if (type === "folder") {
      // recursive function to gather all files inside folder tree
      async function getAllFilesInFolder(folderId: number): Promise<string[]> {
        const fileKeys: string[] = [];

        // files in current folder
        const fileRes = await pool.query(
          `SELECT storage_key FROM files WHERE folder_id=$1 AND owner_id=$2`,
          [folderId, userId]
        );

        for (const row of fileRes.rows) {
          fileKeys.push(row.storage_key);
        }

        // subfolders of this folder
        const folderRes = await pool.query(
          `SELECT id FROM folders WHERE parent_id=$1 AND owner_id=$2`,
          [folderId, userId]
        );

        for (const folder of folderRes.rows) {
          const subFiles = await getAllFilesInFolder(folder.id);
          fileKeys.push(...subFiles);
        }

        return fileKeys;
      }

      // 1️⃣ Get all files recursively
      const allKeys = await getAllFilesInFolder(id);

      // 2️⃣ Delete all files from MinIO
      for (const key of allKeys) {
        await deleteFileFromMinio(key);
      }

      // 3️⃣ Finally delete folder (cascade will remove children)
      await pool.query(`DELETE FROM folders WHERE id=$1 AND owner_id=$2`, [
        id,
        userId,
      ]);

      return res.status(200).json({
        message: "Folder and all nested files deleted successfully",
        deletedFiles: allKeys.length,
      });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
