import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * DIAGNOSTIC ENDPOINT - Direct Supabase comparison test
 * GET /api/debug/direct-test?id=xxx
 * 
 * This bypasses ALL application layers and queries Supabase directly.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('='.repeat(60));
    console.log('[DIRECT TEST] Starting direct Supabase test');
    console.log('[DIRECT TEST] Requested ID:', id);

    if (!id) {
        return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    // Create fresh client with explicit credentials
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        return NextResponse.json({
            error: 'Supabase credentials missing',
            url: !!url,
            key: !!key
        }, { status: 500 });
    }

    console.log('[DIRECT TEST] Supabase URL:', url);
    console.log('[DIRECT TEST] Using key type:',
        process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON');

    // Create completely fresh client
    const supabase = createClient(url, key, {
        auth: { persistSession: false },
    });

    // Query 1: Get the specific record by ID
    console.log('[DIRECT TEST] Query 1: Fetching by ID...');
    const { data: byId, error: error1 } = await supabase
        .from('sunumlar')
        .select('id, slug, baslik, created_at, updated_at')
        .eq('id', id)
        .single();

    // Query 2: Get the LATEST record in the table
    console.log('[DIRECT TEST] Query 2: Fetching latest record...');
    const { data: latest, error: error2 } = await supabase
        .from('sunumlar')
        .select('id, slug, baslik, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // Query 3: Count total records
    const { count } = await supabase
        .from('sunumlar')
        .select('*', { count: 'exact', head: true });

    console.log('[DIRECT TEST] Results:');
    console.log('  - By ID:', byId);
    console.log('  - Latest:', latest);
    console.log('  - Total records:', count);

    const isIdLatest = byId?.id === latest?.id;

    console.log('[DIRECT TEST] Is requested ID the latest?', isIdLatest);
    console.log('='.repeat(60));

    return NextResponse.json({
        requestedId: id,
        recordById: byId || { error: error1?.message },
        latestRecord: latest || { error: error2?.message },
        totalRecords: count,
        isRequestedIdLatest: isIdLatest,
        diagnosis: isIdLatest
            ? '✅ Requested ID IS the latest record - problem is NOT Supabase query'
            : '⚠️ Requested ID is NOT the latest - are you looking at the right presentation?',
    }, {
        headers: {
            'Cache-Control': 'no-store',
        }
    });
}
