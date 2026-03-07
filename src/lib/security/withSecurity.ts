import { NextRequest, NextResponse } from 'next/server';
import { securityConfig, SecurityConfig } from './config';
import { checkRateLimit } from './rateLimiter';
import { reserveBudget } from './budgetTracker';
import { sanitizeObject } from './sanitizer';

type IdentifyUserFn = (params: {
  body: any;
  request: NextRequest;
  ip: string;
}) => string | null | undefined;

type EstimateCostFn = (params: {
  body: any;
  request: NextRequest;
}) => number;

export interface SecurityOptions {
  identifyUser?: IdentifyUserFn;
  estimateCost?: EstimateCostFn;
  configOverride?: Partial<SecurityConfig>;
  sanitizeInput?: boolean;
}

export interface SecurityContext<TBody = any> {
  request: NextRequest;
  body: TBody;
  rawBody: string;
  ip: string;
  userId: string;
  registerActualCost: (cost: number) => void;
}

export type SecureHandler<TBody = any> = (
  context: SecurityContext<TBody>
) => Promise<NextResponse>;

const mergeConfig = (
  override?: Partial<SecurityConfig>
): SecurityConfig => ({
  ...securityConfig,
  ...(override || {}),
});

const getClientIp = (request: NextRequest) => {
  return (
    (request as unknown as { ip?: string }).ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
};

const encoder = new TextEncoder();

export async function withSecurity<TBody = any>(
  request: NextRequest,
  handler: SecureHandler<TBody>,
  options?: SecurityOptions
): Promise<NextResponse> {
  const mergedConfig = mergeConfig(options?.configOverride);
  const ip = getClientIp(request);

  // IP rate limit
  const ipRate = checkRateLimit(
    `ip:${ip}`,
    mergedConfig.ipRateLimit
  );
  if (!ipRate.allowed) {
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_IP_EXCEEDED',
        message: 'Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((ipRate.retryAfterMs ?? 0) / 1000).toString(),
        },
      }
    );
  }

  // Payload kontrolü
  let rawBody = '';
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    rawBody = await request.clone().text();
    const byteLength = encoder.encode(rawBody).byteLength;
    if (byteLength > mergedConfig.payload.maxBytes) {
      return NextResponse.json(
        {
          error: 'PAYLOAD_TOO_LARGE',
          message: 'İstek boyutu çok büyük.',
        },
        { status: 413 }
      );
    }
  }

  let parsedBody: TBody | null = null;

  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'INVALID_JSON',
          message: 'Geçersiz JSON gönderildi.',
        },
        { status: 400 }
      );
    }

    // Sanitize input to prevent XSS
    if (parsedBody && (options?.sanitizeInput !== false)) {
      parsedBody = sanitizeObject(parsedBody as any) as TBody;
    }
  }

  const identifyUser = options?.identifyUser;
  const userId =
    (parsedBody &&
      identifyUser?.({ body: parsedBody, request, ip })) ||
    (parsedBody && (parsedBody as any)?.danisman?.email) ||
    ip;

  const userRate = checkRateLimit(
    `user:${userId}`,
    mergedConfig.userRateLimit
  );
  if (!userRate.allowed) {
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_USER_EXCEEDED',
        message:
          'Bu kullanıcı için istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((userRate.retryAfterMs ?? 0) / 1000).toString(),
        },
      }
    );
  }

  const estimatedCost =
    options?.estimateCost?.({
      body: parsedBody,
      request,
    }) ?? mergedConfig.defaultRequestCost;

  const budgetReservation = reserveBudget(
    userId,
    estimatedCost,
    mergedConfig.budget
  );

  if (!budgetReservation.ok) {
    return NextResponse.json(
      {
        error: 'BUDGET_LIMIT_EXCEEDED',
        message: 'Günlük kullanım kotası aşıldı.',
      },
      { status: 402 }
    );
  }

  let committed = false;

  const registerActualCost = (cost: number) => {
    if (committed) return;
    committed = true;
    budgetReservation.reservation.commit(cost);
  };

  try {
    const response = await handler({
      request,
      body: (parsedBody ?? {}) as TBody,
      rawBody,
      ip,
      userId,
      registerActualCost,
    });

    if (!committed) {
      budgetReservation.reservation.commit(estimatedCost);
      committed = true;
    }

    return response;
  } catch (error) {
    budgetReservation.reservation.cancel();
    throw error;
  }
}

