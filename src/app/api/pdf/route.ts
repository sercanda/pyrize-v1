/**
 * PDF Generation API Route - Gotenberg Integration
 * 
 * POST /api/pdf
 * Body: { id: string }
 * 
 * Features:
 * - Rate limiting: 3 exports per minute per user
 * - Concurrency: max 2 concurrent exports, queue up to 20
 * - Request ID logging for debugging
 * - Gotenberg Chromium endpoint for PDF generation
 * 
 * This is the ONLY PDF export path in the application.
 */

import { NextRequest, NextResponse } from "next/server";
import {
    checkRateLimit,
    recordExport,
    acquireSlot,
    releaseSlot,
    generateRequestId,
    getQueueStatus
} from "@/lib/pdf/rateLimiter";

// Force dynamic execution
export const dynamic = 'force-dynamic';

// Gotenberg URL - configurable via environment
const GOTENBERG_URL = process.env.GOTENBERG_URL || 'http://localhost:3001';

// App base URL for print route
function getAppBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
}

// Get user identifier from request (for rate limiting)
function getUserId(request: NextRequest): string {
    // Try to get user from session/auth header if available
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
        // Hash the auth token to use as user ID
        const token = authHeader.replace('Bearer ', '');
        return `auth:${hashString(token)}`;
    }

    // Fallback to IP-based identification
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';
    return `ip:${ip}`;
}

// Simple string hash for tokens
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

export async function POST(request: NextRequest) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    console.log(`[PDF ${requestId}] ══════════════════════════════════════════`);
    console.log(`[PDF ${requestId}] Starting PDF generation`);

    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            console.log(`[PDF ${requestId}] ❌ Missing ID`);
            return NextResponse.json(
                { error: "Sunum ID'si gerekli", success: false },
                { status: 400 }
            );
        }

        console.log(`[PDF ${requestId}] Presentation ID: ${id}`);

        // ─────────────────────────────────────────────────────────────
        // Rate Limiting
        // ─────────────────────────────────────────────────────────────
        const userId = getUserId(request);
        const rateCheck = checkRateLimit(userId);

        console.log(`[PDF ${requestId}] User: ${userId}, Rate limit: ${rateCheck.remaining} remaining`);

        if (!rateCheck.allowed) {
            console.log(`[PDF ${requestId}] ❌ Rate limited, reset in ${rateCheck.resetIn}s`);
            return NextResponse.json(
                {
                    error: "Çok fazla PDF isteği. Lütfen biraz bekleyin.",
                    resetIn: rateCheck.resetIn,
                    success: false
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateCheck.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateCheck.resetIn.toString()
                    }
                }
            );
        }

        // ─────────────────────────────────────────────────────────────
        // Concurrency Control
        // ─────────────────────────────────────────────────────────────
        const queueStatus = getQueueStatus();
        console.log(`[PDF ${requestId}] Queue status: ${queueStatus.active}/${queueStatus.maxConcurrency} active, ${queueStatus.waiting} waiting`);

        try {
            await acquireSlot();
            console.log(`[PDF ${requestId}] ✅ Slot acquired`);
        } catch (queueError: any) {
            console.log(`[PDF ${requestId}] ❌ Queue full: ${queueError.message}`);
            return NextResponse.json(
                {
                    error: queueError.message || "Sunucu şu anda meşgul. Lütfen daha sonra tekrar deneyin.",
                    success: false
                },
                { status: 503 }
            );
        }

        try {
            // Record this export for rate limiting
            recordExport(userId);

            // ─────────────────────────────────────────────────────────────
            // Build Print URL
            // ─────────────────────────────────────────────────────────────
            const baseUrl = getAppBaseUrl();
            const printUrl = `${baseUrl}/sunum/${id}/print`;

            console.log(`[PDF ${requestId}] Print URL: ${printUrl}`);
            console.log(`[PDF ${requestId}] Gotenberg URL: ${GOTENBERG_URL}`);

            // ─────────────────────────────────────────────────────────────
            // Call Gotenberg
            // ─────────────────────────────────────────────────────────────
            const formData = new FormData();
            formData.append('url', printUrl);
            formData.append('landscape', 'false');
            formData.append('printBackground', 'true');
            formData.append('marginTop', '0');
            formData.append('marginBottom', '0');
            formData.append('marginLeft', '0');
            formData.append('marginRight', '0');
            formData.append('paperWidth', '8.27'); // A4 width in inches
            formData.append('paperHeight', '11.69'); // A4 height in inches
            formData.append('preferCssPageSize', 'true');
            formData.append('waitDelay', '3s'); // Wait for fonts/images to load
            formData.append('emulatedMediaType', 'print');

            const gotenbergEndpoint = `${GOTENBERG_URL}/forms/chromium/convert/url`;
            console.log(`[PDF ${requestId}] Calling Gotenberg: ${gotenbergEndpoint}`);

            const gotenbergResponse = await fetch(gotenbergEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!gotenbergResponse.ok) {
                const errorText = await gotenbergResponse.text();
                console.error(`[PDF ${requestId}] ❌ Gotenberg error: ${gotenbergResponse.status} ${errorText}`);

                // Connection refused or network error
                if (gotenbergResponse.status === 0 || errorText.includes('ECONNREFUSED')) {
                    return NextResponse.json(
                        {
                            error: "Gotenberg sunucusuna bağlanılamıyor. Docker Compose ile Gotenberg'in çalıştığından emin olun.",
                            details: `GOTENBERG_URL: ${GOTENBERG_URL}`,
                            requestId,
                            success: false
                        },
                        { status: 502 }
                    );
                }

                return NextResponse.json(
                    {
                        error: "PDF oluşturulamadı",
                        details: errorText,
                        requestId,
                        success: false
                    },
                    { status: gotenbergResponse.status }
                );
            }

            // ─────────────────────────────────────────────────────────────
            // Stream PDF Response
            // ─────────────────────────────────────────────────────────────
            const pdfBuffer = await gotenbergResponse.arrayBuffer();
            const duration = Date.now() - startTime;

            console.log(`[PDF ${requestId}] ✅ PDF generated in ${duration}ms, size: ${pdfBuffer.byteLength} bytes`);

            // Generate filename
            const filename = `sunum-${id}.pdf`;

            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Content-Length': pdfBuffer.byteLength.toString(),
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'X-Request-Id': requestId,
                    'X-Generation-Time': `${duration}ms`
                },
            });

        } finally {
            // Always release the slot
            releaseSlot();
            console.log(`[PDF ${requestId}] Slot released`);
        }

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`[PDF ${requestId}] ❌ Error after ${duration}ms:`, error);

        // Handle network errors
        if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
            return NextResponse.json(
                {
                    error: "Gotenberg sunucusuna bağlanılamıyor",
                    details: `Gotenberg URL: ${GOTENBERG_URL}. Docker Compose ile 'gotenberg' servisinin çalıştığından emin olun.`,
                    requestId,
                    success: false
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                error: error?.message || "PDF oluşturulurken bir hata oluştu",
                requestId,
                success: false
            },
            { status: 500 }
        );
    }
}

// GET endpoint for testing - redirects to print route
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            {
                error: "ID query param gerekli. Örnek: /api/pdf?id=your-sunum-id",
                success: false
            },
            { status: 400 }
        );
    }

    // Redirect to print route for preview
    const baseUrl = getAppBaseUrl();
    return NextResponse.redirect(`${baseUrl}/sunum/${id}/print`);
}
