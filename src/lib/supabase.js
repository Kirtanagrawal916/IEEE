import { createClient } from '@supabase/supabase-js';

const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const isPlaceholder = (val) => !val || typeof val !== 'string' || val.includes('your-project-ref') || val.includes('your-supabase');

const rawUrl = metaEnv.VITE_SUPABASE_URL;
const rawKey = metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = !isPlaceholder(rawUrl) ? rawUrl : 'https://egoxjudqcifjksuqaqay.supabase.co';
const supabaseAnonKey = !isPlaceholder(rawKey) ? rawKey : 'sb_publishable_hr2RbAb_0VyDR6HZoWgZeg_SogBRg56';


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
  // Graceful local fallback when Supabase cloud is not configured
}

if (!client) {
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signInWithPassword: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      resend: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}

export const supabase = client;
export default supabase;
