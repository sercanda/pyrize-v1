import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * DEBUG ENDPOINT: Shows latest 5 sunumlar
 * Use to verify what's in the database
 * GET /api/debug/latest
 */
export async function GET(req: NextRequest) {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false },
    });

    // Get latest 5 sunumlar
    const { data, error } = await supabase
        .from('sunumlar')
        .select('id, slug, baslik, created_at, updated_at, istek')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = new Date().toISOString();

    return NextResponse.json({
        serverTime: now,
        message: 'Latest 5 presentations from Supabase',
        records: data?.map((r: any) => ({
            id: r.id,
            slug: r.slug,
            baslik: r.baslik,
            created_at: r.created_at,
            konum: r.istek?.mulk?.konum || 'N/A',
            age: `${Math.round((Date.now() - new Date(r.created_at).getTime()) / 60000)} min ago`,
        })),
    });
}
