import { BudgetConfig } from './config';

interface BudgetRecord {
  spent: number;
  pending: number;
  resetAt: number;
}

interface Reservation {
  commit: (actualCost?: number) => void;
  cancel: () => void;
}

const budgets: Map<string, BudgetRecord> = new Map();

const getMidnightMs = () => {
  const now = new Date();
  now.setHours(24, 0, 0, 0);
  return now.getTime();
};

const getBudgetRecord = (key: string): BudgetRecord => {
  const now = Date.now();
  const record = budgets.get(key);

  if (!record || record.resetAt < now) {
    const freshRecord: BudgetRecord = {
      spent: 0,
      pending: 0,
      resetAt: getMidnightMs(),
    };
    budgets.set(key, freshRecord);
    return freshRecord;
  }

  return record;
};

export const reserveBudget = (
  key: string,
  amount: number,
  config: BudgetConfig
): { ok: true; reservation: Reservation } | { ok: false } => {
  if (amount <= 0) {
    return {
      ok: true,
      reservation: {
        commit: () => {},
        cancel: () => {},
      },
    };
  }

  const record = getBudgetRecord(key);
  const projected = record.spent + record.pending + amount;

  if (projected > config.dailyLimit) {
    return { ok: false };
  }

  record.pending += amount;

  let committed = false;

  const commit = (actualCost: number = amount) => {
    if (committed) return;
    committed = true;
    record.pending -= amount;
    record.spent += Math.max(0, actualCost);
  };

  const cancel = () => {
    if (committed) return;
    committed = true;
    record.pending -= amount;
  };

  return {
    ok: true,
    reservation: {
      commit,
      cancel,
    },
  };
};

