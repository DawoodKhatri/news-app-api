import { createClient } from "redis";

const getFromCache = async (key) => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setToCache = async (key, value, ttl = 3600) => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();
    await client.setEx(key, ttl, JSON.stringify(value));
    return;
  } catch (error) {
    return;
  }
};

export { getFromCache, setToCache };
