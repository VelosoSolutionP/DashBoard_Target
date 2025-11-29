import Redis from "redis";
export const redis = Redis.createClient();
redis.connect();