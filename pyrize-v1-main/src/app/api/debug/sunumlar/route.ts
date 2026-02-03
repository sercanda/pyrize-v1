import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

/**
 * Diagnostic endpoint to check sunumlar table
 * GET /api/debug/sunumlar
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseServiceClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
        }

        // Get all presentations ordered by creation date
        const { data, error, count } = await supabase
            .from('sunumlar')
            .select('id, slug, baslik, created_at, updated_at', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            totalCount: count,
            recentRecords: data?.map(r => ({
                id: r.id,
                slug: r.slug,
                baslik: r.baslik,
                created_at: r.created_at,
            })),
            message: 'Bu listede yeni oluşturduğunuz sunum görünüyor mu kontrol edin'
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
