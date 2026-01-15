import { createClient } from "redis";
import "dotenv/config";

console.log("Attempting to connect to Redis with URL:", process.env.REDIS_URL); // Diagnostic log

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL is not defined in your environment variables.");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

(async () => {
  await redisClient.connect();
})();
