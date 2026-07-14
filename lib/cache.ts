interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

class InMemoryCache implements CacheProvider {
  private store = new Map<string, { value: any; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
}

class UpstashRedisCache implements CacheProvider {
  constructor(private url: string, private token: string) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["GET", key]),
        cache: "no-store",
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data.result) return null;
      return JSON.parse(data.result) as T;
    } catch (e) {
      console.warn("Redis GET failed, falling back:", e);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await fetch(`${this.url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", key, JSON.stringify(value), "EX", ttlSeconds]),
        cache: "no-store",
      });
    } catch (e) {
      console.warn("Redis SET failed:", e);
    }
  }
}

let cacheProvider: CacheProvider;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token) {
  cacheProvider = new UpstashRedisCache(url, token);
} else {
  if (!(global as any)._inMemoryCache) {
    (global as any)._inMemoryCache = new InMemoryCache();
  }
  cacheProvider = (global as any)._inMemoryCache;
}

export const cache = cacheProvider;
