import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", (err) => console.error("Redis error:", err));

export async function bumpTrending(postId: string) {
  await redis.zincrby("trending", 1, postId);
}

export async function getTrending(limit = 10) {
  return redis.zrevrange("trending", 0, limit - 1);
}
