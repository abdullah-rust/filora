// src/routes/share/PrivateShare.ts
import { Request, Response } from "express";
import pool from "../../clients/pg";

export default async function PrivateShare(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { id, type } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    if (!id || !type) {
      return res.status(400).json({ message: "Missing id or type" });
    }

    if (!["file", "folder"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'file' or 'folder'." });
    }

    const table = type === "file" ? "files" : "folders";

    // ✅ Step 1: Check ownership and current visibility
    const check = await pool.query(
      `SELECT is_public FROM ${table} WHERE id=$1 AND owner_id=$2 LIMIT 1`,
      [id, userId]
    );

    if (check.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `${type} not found or access denied.` });
    }

    const currentState = check.rows[0].is_public;

    // ✅ Step 2: If already private, skip update
    if (currentState === false) {
      return res.status(200).json({
        message: `${type} is already private.`,
        is_public: false,
      });
    }

    // ✅ Step 3: Otherwise make it private
    await pool.query(
      `UPDATE ${table} SET is_public = FALSE WHERE id = $1 AND owner_id = $2`,
      [id, userId]
    );

    return res.status(200).json({
      message: `${type} is now private.`,
      is_public: false,
    });
  } catch (err) {
    console.error("Error making item private:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
