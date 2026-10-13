import { createClient } from '@supabase/supabase-js';
import * as supabaseServer from '@supabase/server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: false });
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabaseJwksUrl = process.env.SUPABASE_JWKS_URL || (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : '');

let client = null;
if (supabaseUrl && supabaseSecretKey) {
  try {
    client = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (err) {
    console.warn('[Supabase Server] Client initialization notice:', err.message);
  }
} else {
  console.warn('[Supabase Server] Notice: SUPABASE_URL or SUPABASE_SECRET_KEY is not configured in environment variables.');
}

export const supabaseAdmin = client;
export { supabaseServer, supabaseUrl, supabaseSecretKey, supabasePublishableKey, supabaseJwksUrl };
export default supabaseAdmin;
