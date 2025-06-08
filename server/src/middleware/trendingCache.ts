import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);

export async function bumpTrending(postId: string) {
  await redis.zincrby("trending", 1, postId);
}

export async function getTrending(limit = 10) {
  return redis.zrevrange("trending", 0, limit - 1);
}
