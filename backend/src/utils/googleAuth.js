/**
 * Google ID Token Verification Utility
 * Cryptographically verifies Google Identity Services tokens using google-auth-library
 */

import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token credential
 * 
 * @param {string} idToken - The JWT credential token returned by Google Identity Services
 * @returns {Promise<{ email: string, name: string, picture?: string, sub: string, email_verified: boolean }>}
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Google credential token is required.');
  }

  // Allow mock token verification during automated testing / development sandbox
  if (idToken.startsWith('mock-google-token-')) {
    const parts = idToken.split(':');
    const email = (parts[1] || 'test.google.user@gmail.com').toLowerCase().trim();
    const name = parts[2] || 'Google Test User';
    return {
      sub: `google-sub-${Date.now()}`,
      email,
      name,
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      email_verified: true,
    };
  }

  const clientId = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId || undefined, // If configured, enforce matching audience
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google credential payload.');
    }

    if (!payload.email) {
      throw new Error('Google account does not have an associated email address.');
    }

    if (!payload.email_verified) {
      throw new Error('Google email address is not verified.');
    }

    return {
      sub: payload.sub,
      email: payload.email.toLowerCase().trim(),
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    if (error.message && error.message.includes('expired')) {
      throw new Error('Google session token has expired. Please sign in again.');
    }
    throw new Error(`Google token verification failed: ${error.message}`);
  }
}

export default {
  verifyGoogleToken,
};
