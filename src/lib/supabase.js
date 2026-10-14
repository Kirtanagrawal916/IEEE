import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://egoxjudqcifjksuqaqay.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_hr2RbAb_0VyDR6HZoWgZeg_SogBRg56';

let client = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        ...(typeof window !== 'undefined' && window.localStorage ? { storage: window.localStorage } : {}),
      },
    });
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize:', err?.message);
  }
} else {
  console.warn('[Supabase] Notice: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured in environment variables. Running in local fallback mode.');
}

if (!client) {
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signInWithPassword: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signUp: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      resend: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}

export const supabase = client;
export default supabase;

