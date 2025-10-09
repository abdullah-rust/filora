import { Request, Response } from "express";
import pool from "../../clients/pg";

// Interface for unified data
interface FileMeta {
  id: number;
  name: string;
  is_folder: boolean;
  parent_id: number | null;
  uuid: string;
  size?: number;
  mime_type?: string;
  created_at?: Date;
  is_public: boolean;
}

export const loadFilesAndFolders = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const folderIdQuery = req.query["folderId"];
  const currentFolderId =
    folderIdQuery && typeof folderIdQuery === "string"
      ? parseInt(folderIdQuery)
      : null;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorised: Login required." });
  }

  try {
    const filesResult = await pool.query(
      `SELECT 
        id, 
        name, 
        size, 
        mime_type,
        uploaded_at AS created_at, 
        folder_id AS parent_id,
        uuid,               -- ✅ use uuid instead of storage_key
        is_public
       FROM files 
       WHERE owner_id = $1 AND folder_id IS NOT DISTINCT FROM $2 
       ORDER BY name ASC`,
      [userId, currentFolderId]
    );

    // --- 2️⃣ Folders ko Load karna ---
    const foldersResult = await pool.query(
      `SELECT 
          id, 
          name, 
          parent_id,
          created_at,
          is_public,
          id AS uuid          -- ✅ keep consistent uuid-like format
       FROM folders 
       WHERE owner_id = $1 AND parent_id IS NOT DISTINCT FROM $2 
       ORDER BY name ASC`,
      [userId, currentFolderId]
    );

    // --- 3️⃣ Unified structure build karna ---
    const flatData: FileMeta[] = [
      // Files
      ...filesResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        is_folder: false,
        parent_id: row.parent_id || null,
        size: row.size,
        mime_type: row.mime_type,
        uuid: row.uuid, // ✅ direct uuid
        created_at: row.created_at,
        is_public: row.is_public ?? false,
      })),

      // Folders
      ...foldersResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        is_folder: true,
        parent_id: row.parent_id || null,
        uuid: row.uuid.toString(),
        created_at: row.created_at,
        is_public: row.is_public ?? false,
      })),
    ];

    return res.status(200).json({
      data: flatData, // ✅ direct array
    });
  } catch (err) {
    console.error("❌ Database load error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error during data fetch." });
  }
};
