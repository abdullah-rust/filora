import { Request, Response } from "express";
import pool from "../../clients/pg";

export default async function ChangeName(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; // User ID from token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Login required." });
    }

    const { newName } = req.body as { newName?: string };

    if (!newName || newName.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "New name must be at least 2 characters long." });
    }

    // ✅ Optional: prevent same name update
    const existingUser = await pool.query(
      `SELECT name FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (existingUser.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentName = existingUser.rows[0].name;
    if (currentName === newName.trim()) {
      return res
        .status(400)
        .json({ message: "New name must be different from current name." });
    }

    // ✅ Update user name
    await pool.query(
      `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2`,
      [newName.trim(), userId]
    );

    return res.status(200).json({ message: "Name changed successfully." });
  } catch (err) {
    console.error("💥 ChangeName error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}
