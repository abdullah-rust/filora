import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();
const {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
} = process.env;

const useSSL = MINIO_USE_SSL === "true";
// ... (Baaki code jaisa aap ne diya hai)
const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT || "localhost",
  port: MINIO_PORT ? parseInt(MINIO_PORT, 10) : 9000,
  accessKey: MINIO_ACCESS_KEY || "",
  secretKey: MINIO_SECRET_KEY || "",
  useSSL: useSSL,
});

// Is file ko dusri file mein import kar ke check kar sakte hain
// example: in your main file like `index.ts` or `server.ts`

async function checkMinioConnection() {
  try {
    const buckets = await minioClient.listBuckets();
    console.log("Minio se connection kamyab hai. Buckets ki list:", buckets);
  } catch (error) {
    console.error("Minio se connect hone mein masla hai:", error);
    // Yahan aapko credentials ki ghalti ya server down hone ka error milega
  }
}

// Check karein
checkMinioConnection();

export { minioClient };
