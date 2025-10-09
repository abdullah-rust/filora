import { Request, Response } from "express";
import pool from "../../clients/pg";

export default async function getStorageStatus(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user storage limit
    const userResult = await pool.query(
      `SELECT storage_limit FROM users WHERE id=$1`,
      [userId]
    );
    const storageLimit = Number(userResult.rows[0]?.storage_limit || 0);

    // Get used storage
    const usedResult = await pool.query(
      `SELECT COALESCE(SUM(size), 0) AS used_space FROM files WHERE owner_id=$1`,
      [userId]
    );
    const usedSpace = Number(usedResult.rows[0].used_space || 0);

    const percent = storageLimit > 0 ? (usedSpace / storageLimit) * 100 : 0;

    return res.json({
      used: usedSpace,
      limit: storageLimit,
      remaining: storageLimit - usedSpace,
      percent, // 👈 direct percentage
    });
  } catch (err) {
    console.error("❌ Storage status error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
