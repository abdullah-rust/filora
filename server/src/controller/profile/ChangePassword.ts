import { Request, Response } from "express";
import pool from "../../clients/pg";
import { hashPassword, verifyPassword } from "../../utils/paswordHash"; // 👈 use your existing utils

export default async function ChangePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; // Authenticated user ID
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Login required" });
    }

    const { oldPassword, newPassword } = req.body as {
      oldPassword?: string;
      newPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both oldPassword and newPassword are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long." });
    }

    // 1️⃣ Get user's current password hash from DB
    const result = await pool.query(
      `SELECT password FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentHash = result.rows[0].password;

    // 2️⃣ Verify old password using Argon2
    const isOldPasswordCorrect = await verifyPassword(currentHash, oldPassword);
    if (!isOldPasswordCorrect) {
      return res.status(403).json({ message: "Old password is incorrect." });
    }

    // 3️⃣ Prevent reusing same password
    const isSameAsOld = await verifyPassword(currentHash, newPassword);
    if (isSameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different from old password." });
    }

    // 4️⃣ Hash new password
    const newHash = await hashPassword(newPassword);
    if (!newHash) {
      return res.status(500).json({ message: "Failed to hash new password." });
    }

    // 5️⃣ Update password in DB
    await pool.query(
      `UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2`,
      [newHash, userId]
    );

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("💥 ChangePassword error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}
