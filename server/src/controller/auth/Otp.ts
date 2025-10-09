import { Request, Response, NextFunction } from "express";
import z from "zod";
import { deleteVerificationCode, getVerificationCode } from "./other";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import pool from "../../clients/pg";

interface OTP {
  email: string;
  code: string;
  typesubmit: string;
}

interface Login {
  id: string;
  username: string;
  email: string;
  password: string;
  code: string;
}

interface Signup {
  name: string;
  email: string;
  password: string;
  code: string;
}

// ----------------------------------------------------
//  Login OTP Function
// ----------------------------------------------------

export async function LoginOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const OTPData: OTP = (req as any).body;

    const result: any = OPTSchema.safeParse(OTPData);

    if (!result.success) {
      const zodError = result.error;

      const issuesArray = zodError.issues;

      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];

        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: OTP = result.data;

    if (data.typesubmit == "signup") {
      return next();
    }

    const getCode: Login = await getVerificationCode(data.email);

    if (!getCode) {
      return res.status(400).json({ message: "OTP Code Expired" });
    }

    if (getCode.code !== data.code) {
      return res.status(400).json({ message: "OTP Code Invalid" });
    }

    await deleteVerificationCode(getCode.email);

    const accessToken = await createAccessToken(getCode.id);
    const refreshToken = await createRefreshToken(getCode.id);

    if (!accessToken || !refreshToken) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (err: any) {
    console.log("OTP login error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ----------------------------------------------------
//  SignUp OTP Function
// ----------------------------------------------------

export async function SignupOTP(req: Request, res: Response) {
  try {
    const OTPData: OTP = (req as any).body;

    const result: any = OPTSchema.safeParse(OTPData);

    if (!result.success) {
      const zodError = result.error;

      const issuesArray = zodError.issues;

      if (issuesArray && issuesArray.length > 0) {
        const firstIssue = issuesArray[0];

        const errorMessage = firstIssue.message;
        return res.status(400).json({ message: errorMessage });
      }
    }

    const data: OTP = result.data;

    const getCode: Signup = await getVerificationCode(data.email);

    if (!getCode) {
      return res.status(400).json({ message: "OTP Code Expired" });
    }

    if (getCode.code !== data.code) {
      return res.status(400).json({ message: "OTP Code Invalid" });
    }

    await deleteVerificationCode(getCode.email);

    const insert = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id",
      [getCode.name, getCode.email, getCode.password]
    );

    if (insert.rowCount == 0) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const accessToken = await createAccessToken(insert.rows[0].id);
    const refreshToken = await createRefreshToken(insert.rows[0].id);

    if (!accessToken || !refreshToken) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
    return res.status(200).json({ message: "Signup successful" });
  } catch (err: any) {
    console.log("OTP Signup error", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ------------------------------------
//  OTP Schema  Zod
// ------------------------------------
const OPTSchema = z.object({
  email: z.string().email("A valid email address is required").toLowerCase(),
  code: z
    .string()
    .trim()
    .min(6, { message: "Code must be exactly 6 digits" })
    .max(6, { message: "Code must be exactly 6 digits" }),
  typesubmit: z.enum(["login", "signup"]),
});
