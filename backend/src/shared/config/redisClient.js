// import { redisClient } from "../shared/config/redisClient.js";
// await redisClient.connect();
// console.log('Redis connect', await redisClient.isConnected());

import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('end', () => console.log('Redis disconnected'));
redisClient.on('error', (err) => console.log('Redis client error:', err));

export async function connectRedis() {
  await redisClient.connect();
  console.log('Redis connected:', await redisClient.isOpen);
}
