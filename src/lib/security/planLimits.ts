export type PlanType = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  sunumlarPerMonth: number;
  pdfExportsPerDay: number;
  aiRequestsPerDay: number;
  maxFileUploadMB: number;
  rateLimit: {
    windowMs: number;
    ipMax: number;
    userMax: number;
  };
  dailyBudget: number;
}

export const planLimits: Record<PlanType, PlanLimits> = {
  free: {
    sunumlarPerMonth: 5,
    pdfExportsPerDay: 3,
    aiRequestsPerDay: 10,
    maxFileUploadMB: 5,
    rateLimit: {
      windowMs: 60_000,
      ipMax: 30,
      userMax: 15,
    },
    dailyBudget: 1.0,
  },
  pro: {
    sunumlarPerMonth: 50,
    pdfExportsPerDay: 20,
    aiRequestsPerDay: 100,
    maxFileUploadMB: 25,
    rateLimit: {
      windowMs: 60_000,
      ipMax: 120,
      userMax: 60,
    },
    dailyBudget: 10.0,
  },
  enterprise: {
    sunumlarPerMonth: 500,
    pdfExportsPerDay: 100,
    aiRequestsPerDay: 500,
    maxFileUploadMB: 50,
    rateLimit: {
      windowMs: 60_000,
      ipMax: 300,
      userMax: 150,
    },
    dailyBudget: 100.0,
  },
};

export function getPlanLimits(plan?: string): PlanLimits {
  if (plan && plan in planLimits) {
    return planLimits[plan as PlanType];
  }
  return planLimits.free;
}
