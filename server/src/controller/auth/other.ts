import redis from "../../clients/redisClient";

export const VERIFY_PREFIX = "filoraverify:";

/**
 * Saves verification code and user data in Redis with a 5-minute expiry.
 * @param userData - User data object
 * @param code - Verification code
 * @returns boolean indicating success
 */
export async function saveVerificationCode(
  userData: any,
  code: string
): Promise<boolean> {
  try {
    await redis.set(
      `${VERIFY_PREFIX}${userData.email}`,
      JSON.stringify({ ...userData, code }),
      "EX",
      300
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * Retrieves verification code and user data from Redis for the given email.
 * @param email - User's email
 * @returns Parsed user data or null
 */
export async function getVerificationCode(email: string): Promise<any | null> {
  const data = await redis.get(`${VERIFY_PREFIX}${email}`);
  if (data) {
    const parsed = JSON.parse(data);
    return parsed;
  } else {
    return null;
  }
}

/**
 * Deletes verification code from Redis after successful verification.
 * @param email - User's email
 */
export async function deleteVerificationCode(email: string) {
  await redis.del(`${VERIFY_PREFIX}${email}`);
}
