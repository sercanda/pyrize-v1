/**
 * React-PDF Generation API Route
 *
 * POST /api/pdf/react-pdf
 * Body: { id: string }
 *
 * Server-side PDF generation using @react-pdf/renderer.
 * No external dependencies (Gotenberg not required).
 */

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getPdfTemplate } from "@/components/pdf-react";
import {
  checkRateLimit,
  recordExport,
  acquireSlot,
  releaseSlot,
  generateRequestId,
} from "@/lib/pdf/rateLimiter";

export const dynamic = 'force-dynamic';

function getUserId(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = ((hash << 5) - hash) + token.charCodeAt(i);
      hash = hash & hash;
    }
    return `auth:${hash.toString(36)}`;
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  console.log(`[ReactPDF ${requestId}] Starting PDF generation`);

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Sunum ID'si gerekli", success: false },
        { status: 400 }
      );
    }

    // Rate limiting
    const userId = getUserId(request);
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Cok fazla PDF istegi. Lutfen biraz bekleyin.", resetIn: rateCheck.resetIn, success: false },
        { status: 429, headers: { 'Retry-After': rateCheck.resetIn.toString() } }
      );
    }

    // Concurrency
    try {
      await acquireSlot();
    } catch {
      return NextResponse.json(
        { error: "Sunucu su anda mesgul. Lutfen daha sonra tekrar deneyin.", success: false },
        { status: 503 }
      );
    }

    try {
      recordExport(userId);

      // Fetch presentation data
      const supabase = getSupabaseServiceClient();
      if (!supabase) {
        return NextResponse.json(
          { error: "Supabase yapilandirmasi eksik", success: false },
          { status: 500 }
        );
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID = uuidRegex.test(id);

      let sunumData = null;
      if (isUUID) {
        const { data } = await supabase.from("sunumlar").select("*").eq("id", id).single();
        sunumData = data;
      }
      if (!sunumData) {
        const { data } = await supabase.from("sunumlar").select("*").eq("slug", id).single();
        sunumData = data;
      }

      if (!sunumData) {
        return NextResponse.json(
          { error: `Sunum bulunamadi: ${id}`, success: false },
          { status: 404 }
        );
      }

      const { icerik, istek } = sunumData;

      if (!icerik || !istek) {
        return NextResponse.json(
          { error: "Sunum icerigi eksik", success: false },
          { status: 400 }
        );
      }

      // Render PDF in memory using template factory
      console.log(`[ReactPDF ${requestId}] Rendering PDF (stil: ${istek.sunumStili || 'default'}, tema: ${istek.tema || 'default'})...`);
      const pdfElement = getPdfTemplate(istek, icerik);
      const pdfBuffer = await renderToBuffer(pdfElement as any);

      const duration = Date.now() - startTime;
      console.log(`[ReactPDF ${requestId}] PDF generated in ${duration}ms, size: ${pdfBuffer.byteLength} bytes`);

      const filename = `sunum-${sunumData.slug || id}.pdf`;

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': pdfBuffer.byteLength.toString(),
          'Cache-Control': 'no-store',
          'X-Request-Id': requestId,
          'X-Generation-Time': `${duration}ms`,
          'X-PDF-Method': 'react-pdf',
        },
      });
    } finally {
      releaseSlot();
    }
  } catch (error: any) {
    console.error(`[ReactPDF ${requestId}] Error:`, error);
    return NextResponse.json(
      { error: error?.message || "PDF olusturulurken hata olustu", requestId, success: false },
      { status: 500 }
    );
  }
}
