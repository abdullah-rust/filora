// filora-ts-api/src/controllers/fileController.ts

import { Request, Response } from "express";
import pool from "../../clients/pg";

// Interface for unified data (Integer IDs use ki hain)
interface FileMeta {
  id: number;
  name: string;
  is_folder: boolean;
  parent_id: number | null;
  uuid: string;
  size?: number;
  mime_type?: string;
  uploaded_at?: Date;
  created_at?: Date;
}

export const loadFilesAndFolders = async (req: Request, res: Response) => {
  // User ID ko string mein len (assuming JWT se string/number aati hai)
  const userId = (req as any).user?.id;

  const folderIdQuery = req.query["folderId"]; // 👈 Bracket Notation use ki

  const currentFolderId =
    folderIdQuery && typeof folderIdQuery === "string"
      ? parseInt(folderIdQuery)
      : null;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorised: Login required." });
  }

  try {
    // --- 1. Files ko Load karna (us current folder/root se) ---
    const filesResult = await pool.query(
      `SELECT 
        id, 
        name, 
        size, 
        mime_type,
        uploaded_at AS created_at, 
        folder_id AS parent_id,    
        storage_key          -- 👈 Ab direct storage_key nikalenge
     FROM files 
     WHERE owner_id = $1 AND folder_id IS NOT DISTINCT FROM $2 
     ORDER BY name ASC`,
      [userId, currentFolderId]
    );

    // --- 2. Folders ko Load karna (us current folder/root se) ---
    const foldersResult = await pool.query(
      `SELECT 
                id, 
                name, 
                parent_id,
                created_at,
                -- Folder ke liye koi UUID nahi hai to ID ko hi UUID maan lete hain
                id AS uuid          
             FROM folders 
             WHERE owner_id = $1 AND parent_id IS NOT DISTINCT FROM $2 
             ORDER BY name ASC`,
      [userId, currentFolderId]
    );

    // --- 3. Data ko unified flat structure mein merge karna ---
    const flatData: FileMeta[] = [
      // Files
      ...filesResult.rows.map((row) => ({
        ...row,
        is_folder: false,
        parent_id: row.parent_id || null,
        uuid: row.storage_key, // storage_key
      })),
      // Folders
      ...foldersResult.rows.map((row) => ({
        ...row,
        is_folder: true,
        parent_id: row.parent_id || null,
        size: undefined,
        mime_type: undefined,
        uuid: row.uuid.toString(), // Folder ID
      })),
    ];

    // --- 4. Data ko aap ki demand ke mutabiq Nested Object Format mein dena ---
    // { folder1: { name: 'folder1', ... }, file1: { name: 'file1', ... } }
    const currentFolderContent = flatData.reduce((acc: any, item) => {
      // File/Folder ka naam object ki key ban jayega
      acc[item.name] = {
        name: item.name,
        id: item.id,
        is_folder: item.is_folder,
        size: item.size,
        mime_type: item.mime_type,
        // UUID: Files ke liye Storage Key, Folders ke liye ID
        uuid: item.uuid,
      };
      // Agar folder hai to children key ko bhi empty object de dein
      if (item.is_folder) {
        acc[item.name].children = {};
      }
      return acc;
    }, {});

    return res.status(200).json({
      data: currentFolderContent,
    });
  } catch (err) {
    console.error("Database load error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error during data fetch." });
  }
};
