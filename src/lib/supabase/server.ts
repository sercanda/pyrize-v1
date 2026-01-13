import 'server-only';
import { SupabaseClient, createClient } from "@supabase/supabase-js";

/**
 * CRITICAL FIX: Create FRESH Supabase client for each request
 * NO SINGLETON - prevents stale data caching
 */
export const getSupabaseServiceClient = (): SupabaseClient => {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    throw new Error('[Supabase] Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  const apiKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!apiKey) {
    throw new Error('[Supabase] Missing API key');
  }

  // FRESH CLIENT EVERY TIME - NO CACHING
  console.log('[Supabase] Creating fresh client');
  return createClient(SUPABASE_URL, apiKey, {
    auth: { persistSession: false },
  });
};
