import { Request, Response } from "express";
import pool from "../../clients/pg";

// POST /api/folders
export const createFolder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { name, parentId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO folders (name, parent_id, owner_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, parent_id, created_at`,
      [name, parentId || null, userId]
    );

    return res.status(201).json({
      message: "Folder created successfully",
      folder: result.rows[0],
    });
  } catch (err) {
    console.error("Folder create error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
