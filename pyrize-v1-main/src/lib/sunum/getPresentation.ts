import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Check if string is a valid UUID v4 format
 */
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Create a fresh Supabase client for each query
 * CRITICAL: No singleton - prevents any possible client-side caching
 */
function createFreshSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required');
  }

  const apiKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!apiKey) {
    throw new Error('SUPABASE API key is required');
  }

  return createClient(SUPABASE_URL, apiKey, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  });
}

/**
 * Shared helper for presentation lookups
 * Creates FRESH client each call to prevent any caching
 */
export async function getPresentation(identifier: string): Promise<any> {
  if (!identifier || typeof identifier !== 'string' || identifier.trim() === '') {
    throw new Error('Identifier is required');
  }

  // CRITICAL: Create fresh client each time - no caching
  const supabase = createFreshSupabaseClient();
  const trimmedIdentifier = identifier.trim();
  const isIdUUID = isUUID(trimmedIdentifier);

  // If id is UUID => query by id first (not slug)
  if (isIdUUID) {
    console.log('[getPresentation] 🔍 Querying by UUID:', trimmedIdentifier);
    const { data, error } = await supabase
      .from('sunumlar')
      .select('*')
      .eq('id', trimmedIdentifier)
      .single();

    if (!error && data) {
      console.log('[getPresentation] ✅ Found by UUID id:', {
        id: data.id,
        slug: data.slug,
        created_at: data.created_at,
        konum: data.istek?.mulk?.konum
      });
      return data;
    }
    // If UUID lookup fails, continue to slug fallback for backwards compatibility
    console.log('[getPresentation] ⚠️ UUID lookup failed, trying slug fallback:', trimmedIdentifier, error?.message);
  }

  // TASK C: Only if NOT UUID or UUID lookup failed, fallback to slug
  const { data, error } = await supabase
    .from('sunumlar')
    .select('*')
    .eq('slug', trimmedIdentifier)
    .single();

  if (error || !data) {
    console.error('[getPresentation] ❌ Not found:', trimmedIdentifier, error?.message || 'No data');
    throw new Error(`Sunum bulunamadı: ${trimmedIdentifier}`);
  }

  console.log('[getPresentation] ✅ Found by slug:', { id: data.id, slug: data.slug });
  return data;
}
