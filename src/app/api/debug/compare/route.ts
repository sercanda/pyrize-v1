import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

/**
 * Compare two presentations by ID
 * GET /api/debug/compare?id1=xxx&id2=yyy
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id1 = searchParams.get('id1');
        const id2 = searchParams.get('id2');

        if (!id1 || !id2) {
            return NextResponse.json({ error: 'Both id1 and id2 required' }, { status: 400 });
        }

        const supabase = getSupabaseServiceClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
        }

        const [result1, result2] = await Promise.all([
            supabase.from('sunumlar').select('id, slug, baslik, created_at, istek').eq('id', id1).single(),
            supabase.from('sunumlar').select('id, slug, baslik, created_at, istek').eq('id', id2).single()
        ]);

        return NextResponse.json({
            record1: result1.data ? {
                id: result1.data.id,
                slug: result1.data.slug,
                baslik: result1.data.baslik,
                created_at: result1.data.created_at,
                konum: result1.data.istek?.mulk?.konum,
                danismanAd: result1.data.istek?.danisman?.adSoyad,
            } : { error: result1.error?.message },
            record2: result2.data ? {
                id: result2.data.id,
                slug: result2.data.slug,
                baslik: result2.data.baslik,
                created_at: result2.data.created_at,
                konum: result2.data.istek?.mulk?.konum,
                danismanAd: result2.data.istek?.danisman?.adSoyad,
            } : { error: result2.error?.message }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
