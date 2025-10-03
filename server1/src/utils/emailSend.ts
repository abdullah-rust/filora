// mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Transporter create karo
const transporter = nodemailer.createTransport({
  service: "gmail", // agar Gmail use kar rahe ho
  auth: {
    user: process.env["EMAIL_USER"], // tumhari email
    pass: process.env["EMAIL_PASS"], // app password (normal password nahi chalega Gmail ke liye)
  },
});

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Filora" <${process.env["EMAIL_USER"]}>`,
      to: email,
      subject: "Filora Verification Code",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; background: #fff8e1; border: 1px solid #ffe082;">
      <h2 style="color: #ffb300; text-align: center;">🔐 Filora Email Verification</h2>
      <p style="font-size: 16px; color: #5d4037;">
        Assalamualaikum 👋, 
      </p>
      <p style="font-size: 16px; color: #5d4037;">
        Shukriya Filora join karne ke liye. Niche diya gaya verification code apko 5 minute ke andar use karna hoga:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #ffffff; background: #ffb300; padding: 10px 20px; border-radius: 8px; display: inline-block;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #8d6e63;">
        Agar aapne yeh request nahi kiya toh is email ko ignore kar dein.
      </p>
      <p style="font-size: 14px; color: #a1887f; text-align: center; margin-top: 20px;">
        &copy; ${new Date().getFullYear()} Filora. All rights reserved.
      </p>
    </div>
  `,
    });

    return true;
  } catch (e) {
    console.log("Email send error:", e);
    return false;
  }
}
