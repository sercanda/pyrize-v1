import { RateLimitConfig } from './config';

type Bucket = {
  timestamps: number[];
};

const buckets: Map<string, Bucket> = new Map();

const getBucket = (key: string): Bucket => {
  if (!buckets.has(key)) {
    buckets.set(key, { timestamps: [] });
  }
  return buckets.get(key)!;
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export const checkRateLimit = (
  key: string,
  config: RateLimitConfig
): RateLimitResult => {
  const now = Date.now();
  const bucket = getBucket(key);

  // Eski kayıtları temizle
  bucket.timestamps = bucket.timestamps.filter(
    (timestamp) => now - timestamp < config.windowMs
  );

  if (bucket.timestamps.length >= config.max) {
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: config.windowMs - (now - oldest),
    };
  }

  bucket.timestamps.push(now);

  return {
    allowed: true,
    remaining: Math.max(config.max - bucket.timestamps.length, 0),
  };
};

