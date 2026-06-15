const { getRedis } = require('../../config/redis');

const DEFAULT_TTL = 300; // 5 minutes

const cacheGet = async (key) => {
  try {
    const redis = getRedis();
    if (!redis || redis.status !== 'ready') return null;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const cacheSet = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    const redis = getRedis();
    if (!redis || redis.status !== 'ready') return;
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
};

const cacheDel = async (key) => {
  try {
    const redis = getRedis();
    if (!redis || redis.status !== 'ready') return;
    await redis.del(key);
  } catch {}
};

const TTL = {
  SEARCH: 300,        // 5 min
  PRODUCT: 900,       // 15 min
  TRENDING: 3600,     // 1 hr
  AI_RESPONSE: 1800,  // 30 min
  SESSION: 604800,    // 7 days
  HOMEPAGE: 3600,     // 1 hr
};

module.exports = { cacheGet, cacheSet, cacheDel, TTL };
