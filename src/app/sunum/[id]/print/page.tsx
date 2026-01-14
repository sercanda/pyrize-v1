/**
 * PDF Print Route - PDF-First Layout for Gotenberg Rendering
 * 
 * This route renders the presentation in a deterministic PDF layout:
 * - Fixed 6 A4 pages for DetailedAnalysis template
 * - No dynamic page breaks - all content deterministically allocated
 * - Optimized for Chromium PDF rendering
 * - No interactive elements or animations
 * 
 * This page is NOT meant for web viewing - it's specifically for PDF generation.
 */
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import PdfDocument from "@/components/pdf/PdfDocument";
import "./print.css";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getSunumData(identifier: string) {
    const supabaseServer = getSupabaseServiceClient();

    if (!supabaseServer) {
        console.warn('[PrintPage] Supabase not configured');
        return null;
    }

    // UUID regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(identifier);

    let sunum = null;

    // Try UUID lookup first
    if (isUUID) {
        const result = await supabaseServer
            .from("sunumlar")
            .select("*")
            .eq("id", identifier)
            .single();
        sunum = result.data;
    }

    // Fallback to slug lookup
    if (!sunum) {
        const result = await supabaseServer
            .from("sunumlar")
            .select("*")
            .eq("slug", identifier)
            .single();
        sunum = result.data;
    }

    return sunum;
}

export default async function PrintPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const queryParams = await searchParams;
    const isDebug = queryParams.debug === '1';
    const condensed = queryParams.condensed === '1';

    if (!id) {
        return (
            <div className="pdf-error">
                <h1>Hata</h1>
                <p>Sunum ID'si gerekli</p>
            </div>
        );
    }

    // Fetch presentation data server-side
    const sunumData = await getSunumData(id);

    if (!sunumData) {
        return (
            <div className="pdf-error">
                <h1>Hata</h1>
                <p>Sunum bulunamadı: {id}</p>
            </div>
        );
    }

    // Format data for PdfDocument
    const formattedData = {
        id: sunumData.id,
        slug: sunumData.slug,
        baslik: sunumData.baslik,
        durum: sunumData.durum,
        icerik: sunumData.icerik,
        istek: sunumData.istek,
        olusturmaTarihi: sunumData.created_at,
        guncellemeTarihi: sunumData.updated_at
    };

    return (
        <html lang="tr">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{sunumData.baslik || 'Sunum'} - PDF</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className={condensed ? 'pdf-condensed-mode' : ''}>
                {isDebug && (
                    <div className="pdf-debug-banner">
                        <strong>DEBUG MODE</strong> |
                        ID: {sunumData.id?.slice(0, 8)}... |
                        Slug: {sunumData.slug} |
                        Created: {sunumData.created_at}
                    </div>
                )}

                <PdfDocument data={formattedData as any} condensed={condensed} />
            </body>
        </html>
    );
}
