let createClient = null;
try {
  // Optional dynamic resolution if available
  const mod = await import(/* @vite-ignore */ '@supabase/supabase-js').catch(() => null);
  if (mod && mod.createClient) {
    createClient = mod.createClient;
  }
} catch (e) {
  // Fallback
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

let client = null;

if (createClient && supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: window.localStorage,
      },
    });
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize:', err?.message);
  }
} else {
  // Fallback mode
}

if (!client) {
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: async () => ({ error: new Error('Supabase authentication is not configured in environment variables.') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}

export const supabase = client;
export default supabase;
