import { Request, Response } from "express";
import pool from "../../clients/pg";

export default async function GetUserName(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Login required" });
    }

    // 🧠 Query user name from DB
    const result = await pool.query(
      `SELECT name FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userName = result.rows[0].name;

    // ✅ Success
    return res.status(200).json({ name: userName });
  } catch (err) {
    console.error("💥 Error fetching user name:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
