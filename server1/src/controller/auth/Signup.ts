import { Request, Response } from "express";
import { z } from "zod";
import pool from "../../clients/pg";
import { hashPassword } from "../../utils/paswordHash";
import { generate6DigitCode } from "../../utils/genrateCode";
import { sendVerificationEmail } from "../../utils/emailSend";
import { saveVerificationCode } from "./other";

interface Signup {
  name: string;
  email: string;
  password: string;
}

// ----------------------------------------------------
//  SignUp api Function
// ----------------------------------------------------

export default async function Signup(req: Request, res: Response) {
  try {
    const formData: Signup = (req as any).body;

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

    const data: Signup = result.data;

    const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [
      data.email,
    ]);

    if (checkUser.rowCount != 0) {
      return res.status(400).json({ message: "User Alrady exist" });
    }

    const hash = await hashPassword(data.password);

    if (!hash) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const code = await generate6DigitCode();
    if (!code) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const sendEmail = await sendVerificationEmail(data.email, code);

    if (!sendEmail) {
      return res
        .status(500)
        .json({ message: "OTP sending failed, try again later" });
    }

    data.password = hash;

    const saveToredis = await saveVerificationCode(data, code);

    if (!saveToredis) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err: any) {
    console.log("signup error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ----------------------------------------------------
//  Zod User Signup Schema
// ----------------------------------------------------

export const UserBasicSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name is too long (max 100 characters)")
    .trim(), // removes leading/trailing spaces

  email: z.string().email("A valid email address is required").toLowerCase(), // normalize to lowercase

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long (max 128 characters)"),
});
