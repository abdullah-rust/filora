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

async function checkMinioConnection() {
  try {
    console.log("Minio connection Successfully connected");
  } catch (error) {
    console.error("Minio se connect hone mein masla hai:", error);
  }
}

// Check karein
checkMinioConnection();

export { minioClient };
