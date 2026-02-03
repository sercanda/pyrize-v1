/**
 * PDF Export Rate Limiter and Concurrency Control
 * 
 * - Rate Limit: 3 exports per minute per user (sliding window)
 * - Concurrency: Max 2 concurrent exports server-wide
 * - Queue: Max 20 waiting exports
 */

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────
const RATE_LIMIT = parseInt(process.env.PDF_RATE_LIMIT || '3', 10);
const RATE_WINDOW_SECONDS = parseInt(process.env.PDF_RATE_WINDOW_SECONDS || '60', 10);
const MAX_CONCURRENCY = parseInt(process.env.PDF_CONCURRENCY || '2', 10);
const MAX_QUEUE = parseInt(process.env.PDF_QUEUE_LIMIT || '20', 10);


// ─────────────────────────────────────────────────────────────
// Rate Limiter - Sliding Window
// ─────────────────────────────────────────────────────────────
interface RateLimitEntry {
    timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if user is rate limited
 * @param userId - User identifier (user ID or IP hash)
 * @returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(userId: string): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
} {
    const now = Date.now();
    const windowMs = RATE_WINDOW_SECONDS * 1000;
    const windowStart = now - windowMs;

    let entry = rateLimitStore.get(userId);
    if (!entry) {
        entry = { timestamps: [] };
        rateLimitStore.set(userId, entry);
    }

    // Remove expired timestamps
    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

    const count = entry.timestamps.length;
    const remaining = Math.max(0, RATE_LIMIT - count);

    if (count >= RATE_LIMIT) {
        // Find when the oldest request will expire
        const oldestTimestamp = Math.min(...entry.timestamps);
        const resetIn = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
        return { allowed: false, remaining: 0, resetIn };
    }

    return { allowed: true, remaining, resetIn: RATE_WINDOW_SECONDS };
}

/**
 * Record an export request for rate limiting
 * @param userId - User identifier
 */
export function recordExport(userId: string): void {
    const now = Date.now();
    let entry = rateLimitStore.get(userId);
    if (!entry) {
        entry = { timestamps: [] };
        rateLimitStore.set(userId, entry);
    }
    entry.timestamps.push(now);
}

// ─────────────────────────────────────────────────────────────
// Concurrency Semaphore
// ─────────────────────────────────────────────────────────────
interface QueuedRequest {
    resolve: () => void;
    reject: (error: Error) => void;
}

let activeCount = 0;
const waitingQueue: QueuedRequest[] = [];

/**
 * Acquire a slot for PDF generation
 * @returns Promise that resolves when slot is acquired
 * @throws Error if queue is full
 */
export async function acquireSlot(): Promise<void> {
    if (activeCount < MAX_CONCURRENCY) {
        activeCount++;
        return;
    }

    if (waitingQueue.length >= MAX_QUEUE) {
        throw new Error(`PDF kuyruk sınırına ulaşıldı (${MAX_QUEUE}). Lütfen daha sonra tekrar deneyin.`);
    }

    return new Promise<void>((resolve, reject) => {
        waitingQueue.push({ resolve, reject });
    });
}

/**
 * Release a slot after PDF generation completes
 */
export function releaseSlot(): void {
    if (waitingQueue.length > 0) {
        const next = waitingQueue.shift();
        if (next) {
            next.resolve();
        }
    } else {
        activeCount = Math.max(0, activeCount - 1);
    }
}

/**
 * Get current status of the semaphore
 */
export function getQueueStatus(): { active: number; waiting: number; maxConcurrency: number } {
    return {
        active: activeCount,
        waiting: waitingQueue.length,
        maxConcurrency: MAX_CONCURRENCY
    };
}

// ─────────────────────────────────────────────────────────────
// Request ID Generator
// ─────────────────────────────────────────────────────────────
let requestCounter = 0;

export function generateRequestId(): string {
    requestCounter++;
    const timestamp = Date.now().toString(36);
    const counter = requestCounter.toString(36).padStart(4, '0');
    return `pdf-${timestamp}-${counter}`;
}

// ─────────────────────────────────────────────────────────────
// Cleanup (for tests or graceful shutdown)
// ─────────────────────────────────────────────────────────────
export function resetRateLimiter(): void {
    rateLimitStore.clear();
    activeCount = 0;
    waitingQueue.forEach(req => req.reject(new Error('Rate limiter reset')));
    waitingQueue.length = 0;
}
