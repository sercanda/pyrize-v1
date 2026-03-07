'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

function getClient(): SupabaseClient | null {
  try {
    return createSupabaseBrowserClient();
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => getClient(), []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { data: null, error: new Error('Supabase not configured') };
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string, metadata?: { name?: string }) => {
      if (!supabase) return { data: null, error: new Error('Supabase not configured') };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      return { data, error };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
