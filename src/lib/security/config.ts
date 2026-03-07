export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface PayloadConfig {
  maxBytes: number;
}

export interface BudgetConfig {
  dailyLimit: number;
}

export interface SecurityConfig {
  ipRateLimit: RateLimitConfig;
  userRateLimit: RateLimitConfig;
  payload: PayloadConfig;
  budget: BudgetConfig;
  defaultRequestCost: number;
}

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

import { getPlanLimits, type PlanType } from './planLimits';

export const securityConfig: SecurityConfig = {
  ipRateLimit: {
    windowMs: parseNumber(process.env.API_RATE_LIMIT_WINDOW_MS, 60_000),
    max: parseNumber(process.env.API_RATE_LIMIT_IP_MAX, 60),
  },
  userRateLimit: {
    windowMs: parseNumber(process.env.API_RATE_LIMIT_WINDOW_MS_USER, 60_000),
    max: parseNumber(process.env.API_RATE_LIMIT_USER_MAX, 30),
  },
  payload: {
    maxBytes: parseNumber(process.env.API_MAX_PAYLOAD_BYTES, 280_000), // ~280 KB
  },
  budget: {
    dailyLimit: parseNumber(process.env.API_DAILY_SPEND_LIMIT, 1), // Default: free plan ($1/day)
  },
  defaultRequestCost: parseNumber(process.env.API_DEFAULT_REQUEST_COST, 0.35),
};

export function getSecurityConfigForPlan(plan?: PlanType): SecurityConfig {
  const limits = getPlanLimits(plan);
  return {
    ipRateLimit: {
      windowMs: limits.rateLimit.windowMs,
      max: limits.rateLimit.ipMax,
    },
    userRateLimit: {
      windowMs: limits.rateLimit.windowMs,
      max: limits.rateLimit.userMax,
    },
    payload: securityConfig.payload,
    budget: {
      dailyLimit: limits.dailyBudget,
    },
    defaultRequestCost: securityConfig.defaultRequestCost,
  };
}

