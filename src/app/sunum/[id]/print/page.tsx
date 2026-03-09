/**
 * PDF Print Route - Renders the SAME template as web preview for Gotenberg
 *
 * This route renders the presentation using TemplateRenderer (same as web view)
 * with PDF-optimized CSS applied via .pdf-render-mode class.
 *
 * Gotenberg captures this page with emulatedMediaType: 'screen' to preserve
 * backgrounds, gradients, and visual effects.
 */
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
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

    if (!id) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px' }}>
                <div>
                    <h1 style={{ color: '#dc2626', fontSize: '24pt' }}>Hata</h1>
                    <p>Sunum ID&apos;si gerekli</p>
                </div>
            </div>
        );
    }

    // Fetch presentation data server-side
    const sunumData = await getSunumData(id);

    if (!sunumData) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px' }}>
                <div>
                    <h1 style={{ color: '#dc2626', fontSize: '24pt' }}>Hata</h1>
                    <p>Sunum bulunamadı: {id}</p>
                </div>
            </div>
        );
    }

    // Format data for TemplateRenderer (same format as web view)
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
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=block"
                    rel="stylesheet"
                />
            </head>
            <body>
                {isDebug && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0,
                        background: '#fef3c7', borderBottom: '2px solid #f59e0b',
                        padding: '4px 10mm', fontSize: '8pt', fontFamily: 'monospace',
                        color: '#92400e', zIndex: 9999
                    }}>
                        <strong>DEBUG MODE</strong> |
                        ID: {sunumData.id?.slice(0, 8)}... |
                        Slug: {sunumData.slug} |
                        Created: {sunumData.created_at}
                    </div>
                )}

                {/* Render the SAME template as web preview, wrapped in pdf-render-mode */}
                <div className="pdf-render-mode">
                    <TemplateRenderer data={formattedData as any} />
                </div>

                {/* Signal to Gotenberg that the page is ready for PDF capture */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                Promise.all([
                                    document.fonts ? document.fonts.ready : Promise.resolve(),
                                    new Promise(function(resolve) {
                                        var images = document.querySelectorAll('img');
                                        if (images.length === 0) return resolve();
                                        var loaded = 0;
                                        images.forEach(function(img) {
                                            if (img.complete) { loaded++; if (loaded === images.length) resolve(); }
                                            else {
                                                img.onload = img.onerror = function() { loaded++; if (loaded === images.length) resolve(); };
                                            }
                                        });
                                    })
                                ]).then(function() {
                                    window.pdfReady = true;
                                });
                                setTimeout(function() { window.pdfReady = true; }, 5000);
                            })();
                        `,
                    }}
                />
            </body>
        </html>
    );
}
