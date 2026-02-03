import { NextRequest, NextResponse } from 'next/server';
import { getPresentation } from '@/lib/sunum/getPresentation';

/**
 * STEP G: Debug endpoint to validate lookup
 * GET /api/debug/sunum?id=...
 * Returns: identifier, lookup result, whether record exists, created_at, updated_at, id, slug
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { error: 'id parametresi gerekli' },
        { status: 400 }
      );
    }

    const identifier = id.trim();
    let record = null;
    let exists = false;
    let lookupResult: 'id' | 'slug' | 'none' = 'none';
    let error: string | null = null;

    try {
      record = await getPresentation(identifier);
      exists = true;
      
      // Determine which field matched (id or slug)
      if (record.id === identifier) {
        lookupResult = 'id';
      } else if (record.slug === identifier) {
        lookupResult = 'slug';
      }
    } catch (err: any) {
      error = err?.message || 'Unknown error';
      exists = false;
    }

    return NextResponse.json({
      identifier,
      lookupResult,
      exists,
      record: exists ? {
        id: record.id,
        slug: record.slug,
        created_at: record.created_at,
        updated_at: record.updated_at,
        baslik: record.baslik?.substring(0, 50),
      } : null,
      error: error || null,
    });
  } catch (error: any) {
    console.error('[Debug] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}


