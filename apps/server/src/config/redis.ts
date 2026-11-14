import { createClient } from "redis";

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const redisUrl = process.env.REDIS_URL;

/**
 * Minimal surface of the Redis client used by the app. When REDIS_URL is not
 * set (e.g. a free-tier demo deployment), a no-op cache is used so the server
 * still starts and every request simply reads from the database.
 */
type CacheClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
  del(keys: string | string[]): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
};

const noopCache: CacheClient = {
  get: async () => null,
  set: async () => null,
  del: async () => 0,
  keys: async () => [],
};

function createRedisClient(): CacheClient {
  if (!redisUrl) {
    console.warn("REDIS_URL is not set. Running without a cache.");
    return noopCache;
  }

  const client = createClient({ url: redisUrl });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  client.on("connect", () => {
    console.log("Connected to Redis");
  });

  client.connect().catch((err) => {
    console.error("Redis connection failed:", err);
  });

  return client as unknown as CacheClient;
}

export const redisClient = createRedisClient();
