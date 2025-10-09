import argon2 from "argon2";

// Function: Hash password
export async function hashPassword(password: string): Promise<string | null> {
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Secure variant
      memoryCost: 2 ** 16, // 64 MB (balanced)
      timeCost: 3, // Iterations
      parallelism: 1, // Single-thread (server crash-proof)
    });
    return hash;
  } catch (err) {
    console.error("Password hashing failed:", err);
    return null;
  }
}

// Function: Verify password
export async function verifyPassword(
  hash: string,
  plainPassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch (err) {
    console.error("Password verification failed:", err);
    return false;
  }
}
