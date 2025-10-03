import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env["REDIS_URL"] || "redis://localhost:6379");

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err: any) => {
  console.error("❌ Redis error", err);
});

export default redis;
