import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

// CRITICAL: Force dynamic execution - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Route param named 'id' but supports both UUID and slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: identifier } = await params; // Rename to identifier to clarify it can be UUID or slug

        if (!identifier) {
            return NextResponse.json(
                { error: "ID veya slug gerekli" },
                { status: 400 }
            );
        }

        // Lazy init - returns null if env vars missing (build-time safe)
        const supabaseServer = getSupabaseServiceClient();

        if (!supabaseServer) {
            return NextResponse.json(
                { error: "Supabase yapılandırılmamış" },
                { status: 503 }
            );
        }

        // UUID regex accepts any UUID format (not just v4) for better compatibility
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUUID = uuidRegex.test(identifier);

        let sunum = null;
        let fetchError: any = null;
        let lookupMethod = '';

        // Step 1: Try UUID lookup first (if identifier is UUID format)
        if (isUUID) {
            lookupMethod = 'UUID (id)';
            console.log(`[Fetch] 📋 Lookup method: UUID (id), identifier: ${identifier}`);
            const result = await supabaseServer
                .from("sunumlar")
                .select("*")
                .eq("id", identifier)
                .single();
            sunum = result.data;
            fetchError = result.error;

            if (sunum) {
                console.log(`[Fetch] ✅ Record found via UUID (id):`, { id: sunum.id, slug: sunum.slug });
            } else {
                console.log(`[Fetch] ⚠️ UUID lookup failed, trying slug lookup`);
            }
        }

        // Step 2: If UUID lookup failed or identifier is not UUID, try slug lookup
        if (!sunum) {
            lookupMethod = isUUID ? 'slug (UUID not found)' : 'slug';
            console.log(`[Fetch] 📋 Lookup method: slug, identifier: ${identifier}`);
            const result = await supabaseServer
                .from("sunumlar")
                .select("*")
                .eq("slug", identifier)
                .single();
            sunum = result.data;
            fetchError = result.error;

            if (sunum) {
                console.log(`[Fetch] ✅ Record found via slug:`, { id: sunum.id, slug: sunum.slug });
            } else {
                console.log(`[Fetch] ⚠️ Slug lookup failed`);
            }
        }

        if (fetchError || !sunum) {
            console.log(`❌ Sunum bulunamadı (${lookupMethod}): ${identifier}`, fetchError);
            return NextResponse.json(
                {
                    error: "Sunum bulunamadı",
                    attemptedLookup: lookupMethod,
                    identifier
                },
                { status: 404 }
            );
        }

        console.log(`✅ Sunum bulundu (${lookupMethod}):`, { id: sunum.id, slug: sunum.slug, updated_at: sunum.updated_at });

        // Standardized response format with id, slug, updated_at
        const formattedData = {
            id: sunum.id, // UUID (canonical identifier)
            slug: sunum.slug, // Human-readable slug
            updated_at: sunum.updated_at, // ISO timestamp for cache validation
            baslik: sunum.baslik,
            durum: sunum.durum,
            icerik: sunum.icerik,
            istek: sunum.istek,
            olusturmaTarihi: sunum.created_at, // Keep for backward compatibility
            guncellemeTarihi: sunum.updated_at // Keep for backward compatibility
        };

        return NextResponse.json({
            success: true,
            data: formattedData
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error: any) {
        console.error("❌ Sunum getirme API hatası:", error);
        return NextResponse.json(
            { error: error?.message || "Sunum getirilirken bir hata meydana geldi" },
            { status: 500 }
        );
    }
}
