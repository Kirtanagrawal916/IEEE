import { createClient } from '@supabase/supabase-js';
import * as supabaseServer from '@supabase/server';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://egoxjudqcifjksuqaqay.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabaseJwksUrl = process.env.SUPABASE_JWKS_URL || `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

if (!supabaseUrl || !supabaseSecretKey) {
  console.warn('[Supabase Server] Warning: SUPABASE_URL or SUPABASE_SECRET_KEY is missing from environment.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export { supabaseServer, supabaseUrl, supabaseSecretKey, supabasePublishableKey, supabaseJwksUrl };
export default supabaseAdmin;
