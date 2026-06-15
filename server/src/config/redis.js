const Redis = require('ioredis');

let redisClient = null;

const connectRedis = () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('⚠️  Redis connection failed, running without cache');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => console.log('✅ Redis Connected'));
    redisClient.on('error', (err) => {
      console.warn('⚠️  Redis error (non-fatal):', err.message);
    });

    redisClient.connect().catch(() => {});
  } catch (err) {
    console.warn('⚠️  Redis unavailable, running without cache');
  }
  return redisClient;
};

const getRedis = () => redisClient;

module.exports = { connectRedis, getRedis };
