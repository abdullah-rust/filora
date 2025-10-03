// genCode.js
import { randomInt } from "crypto";

/**
 * Generate a secure 6-digit numeric code as a string (keeps leading zeros).
 * @returns {string} e.g. "004321"
 */
export async function generate6DigitCode() {
  const n = randomInt(0, 1_000_000); // 0 .. 999999
  return String(n).padStart(6, "0");
}
