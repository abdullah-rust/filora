// File: src/utils/minioUpload.ts

import { minioClient } from "../clients/minio"; // tumhara jo client setup file hai
import { v4 as uuidv4 } from "uuid";
import path from "path";

const BUCKET_NAME = "filorafiles"; // apna bucket name

// Ensure bucket exists
async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1"); // region as needed
    console.log(`Bucket '${BUCKET_NAME}' created.`);
  }
}

/**
 * Upload a file buffer or path to MinIO
 * @param fileBuffer Buffer | string (file path)
 * @param originalName original file name (for extension)
 * @returns objectKey jo Redis me store karenge
 */
export async function uploadFileToMinio(
  fileBuffer: Buffer | string,
  originalName: string
): Promise<string> {
  await ensureBucketExists();

  // Generate unique key for MinIO
  const extension = path.extname(originalName); // .jpg, .pdf etc
  const objectKey = uuidv4() + extension;

  // Upload file
  if (fileBuffer instanceof Buffer) {
    await minioClient.putObject(BUCKET_NAME, objectKey, fileBuffer);
  } else if (typeof fileBuffer === "string") {
    // agar file path diya hai
    await minioClient.fPutObject(BUCKET_NAME, objectKey, fileBuffer);
  } else {
    throw new Error("Invalid file input, must be Buffer or path string");
  }

  console.log(`File '${originalName}' uploaded to MinIO as '${objectKey}'`);
  return objectKey; // ye value Redis me store karenge
}
