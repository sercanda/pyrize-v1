import 'server-only';
import { SupabaseClient, createClient } from "@supabase/supabase-js";

/**
 * Check if Supabase environment variables are configured
 * Use this for build-time safe checks
 */
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key);
};

/**
 * Create FRESH Supabase client for each request
 * Returns null if env vars are missing (build-time safe)
 * NO SINGLETON - prevents stale data caching
 */
export const getSupabaseServiceClient = (): SupabaseClient | null => {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    console.warn('[Supabase] Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
    return null;
  }

  const apiKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!apiKey) {
    console.warn('[Supabase] Missing API key (SERVICE_ROLE_KEY or ANON_KEY)');
    return null;
  }

  // FRESH CLIENT EVERY TIME - NO CACHING
  console.log('[Supabase] Creating fresh client');
  return createClient(SUPABASE_URL, apiKey, {
    auth: { persistSession: false },
  });
};

