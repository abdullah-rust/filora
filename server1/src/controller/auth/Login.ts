import { Request, Response } from "express";
import { z } from "zod";
import pool from "../../clients/pg";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";
import { saveVerificationCode } from "./other";
import { verifyPassword } from "../../utils/paswordHash";

interface Login {
  id?: string;
  email: string;
  password: string;
}

// ----------------------------------------------------
//  Login api Function
// ----------------------------------------------------

export default async function Login(req: Request, res: Response) {
  try {
    const formData: Login = (req as any).body;

    const result: any = UserBasicSchema.safeParse(formData);

    if (!result.success) {
      const zodError = result.error;

      const issuesArray = zodError.issues;

      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];

        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: Login = result.data;

    const checkUser = await pool.query(
      "SELECT id,password FROM users WHERE email=$1",
      [data.email]
    );

    if (checkUser.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "User not found or invalid email" });
    }

    const matchPsw = await verifyPassword(
      checkUser.rows[0].password,
      data.password
    );

    if (!matchPsw) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const code = await generate6DigitCode();
    if (!code) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    data.id = checkUser.rows[0].id; // yahan main ne pehle nhi tha kiya

    const sendEmail = await sendVerificationEmail(data.email, code);

    if (!sendEmail) {
      return res
        .status(500)
        .json({ message: "OTP sending failed, try again later" });
    }

    const saveToredis = await saveVerificationCode(data, code);

    if (!saveToredis) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err: any) {
    console.log("login error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ----------------------------------------------------
//  Zod User Login Schema
// ----------------------------------------------------

export const UserBasicSchema = z.object({
  email: z.string().email("A valid email address is required").toLowerCase(), // normalize to lowercase

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long (max 128 characters)"),
});
