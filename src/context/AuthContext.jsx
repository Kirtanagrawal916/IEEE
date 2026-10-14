import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herearn_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('herearn_jwt_token'));
  const [loading, setLoading] = useState(true);
  const isSyncingRef = useRef(false);

  // Sync Supabase session with backend DB and local state
  const syncSupabaseSession = async (currentSession) => {
    if (!currentSession || !currentSession.access_token) return;
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const accessToken = currentSession.access_token;
      setSession(currentSession);
      setToken(accessToken);
      localStorage.setItem('herearn_jwt_token', accessToken);

      // Exchange / synchronize with backend
      const res = await api.supabaseSync(accessToken).catch((err) => {
        console.warn('[AuthContext] Backend sync notice:', err.message);
        return null;
      });

      if (res?.success && res.user) {
        setUser(res.user);
        localStorage.setItem('herearn_user', JSON.stringify(res.user));
      } else {
        // Fallback to Supabase user metadata if backend sync is still propagating
        const sbUser = currentSession.user;
        if (sbUser) {
          const meta = sbUser.user_metadata || {};
          const fallbackUser = {
            id: sbUser.id,
            email: sbUser.email,
            name: meta.full_name || meta.name || sbUser.email.split('@')[0],
            avatar:
              meta.avatar_url ||
              meta.picture ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sbUser.id)}`,
            role: 'LEARNER',
            skills: ['Digital Marketing', 'Graphic Design'],
            totalEarned: 0,
            status: 'Active',
          };
          setUser((prev) => prev || fallbackUser);
          localStorage.setItem('herearn_user', JSON.stringify(fallbackUser));
        }
      }

      // Clean up OAuth query parameters/hash from URL without reloading
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const search = window.location.search;
        if (hash.includes('access_token') || search.includes('code=')) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    } finally {
      isSyncingRef.current = false;
    }
  };

  // Initialize Auth & listen for state changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // 1. Check for active Supabase session
        const { data: { session: existingSession } } = await supabase.auth.getSession();

        if (existingSession && mounted) {
          await syncSupabaseSession(existingSession);
        } else {
          // 2. Check for backend session or existing local JWT
          const storedToken = localStorage.getItem('herearn_jwt_token');
          if (storedToken) {
            try {
              const res = await api.getMe();
              if (res.success && res.user && mounted) {
                setUser(res.user);
                localStorage.setItem('herearn_user', JSON.stringify(res.user));
              }
            } catch {
              // Token might be expired, clear
              if (mounted) {
                localStorage.removeItem('herearn_jwt_token');
                localStorage.removeItem('herearn_user');
                setUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Session initialization notice:', err.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 3. Listen for Supabase Auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (currentSession) {
          await syncSupabaseSession(currentSession);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('herearn_jwt_token');
        localStorage.removeItem('herearn_user');
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (options = {}) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: options.redirectTo || `${window.location.origin}/`,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const login = async (credentials) => {
    const { email, password, username } = credentials || {};
    let targetEmail = (email || '').trim().toLowerCase();
    const targetPassword = password || '';
    const cleanUsername = (username || '').trim().toLowerCase().replace(/^@/, '');

    // Resolve email from username if email wasn't directly provided
    if (!targetEmail && cleanUsername) {
      try {
        const regUsers = JSON.parse(localStorage.getItem('herearn_registered_users') || '[]');
        const matched = regUsers.find(u => u.username?.toLowerCase() === cleanUsername);
        if (matched?.email) {
          targetEmail = matched.email.toLowerCase();
        }
      } catch {}
    }

    // 1. If email & password provided, attempt Supabase Auth signInWithPassword
    if (targetEmail && targetEmail.includes('@') && targetPassword) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: targetPassword,
        });

        if (error) {
          const msg = error.message || '';
          if (msg.toLowerCase().includes('email not confirmed')) {
            const unconfirmedError = new Error('Please confirm your email address before logging in. Check your inbox for the verification link.');
            unconfirmedError.isEmailUnconfirmed = true;
            unconfirmedError.email = targetEmail;
            throw unconfirmedError;
          }
          // If invalid login credentials on Supabase, proceed to check API backend fallback
          if (!msg.toLowerCase().includes('invalid login credentials')) {
            throw error;
          }
        } else if (data?.session) {
          // Double check that the user is confirmed
          if (!data.user?.confirmed_at && !data.user?.email_confirmed_at) {
            await supabase.auth.signOut().catch(() => {});
            const unconfirmedError = new Error('Please confirm your email address before logging in. Check your inbox for the verification link.');
            unconfirmedError.isEmailUnconfirmed = true;
            unconfirmedError.email = targetEmail;
            throw unconfirmedError;
          }

          await syncSupabaseSession(data.session);
          return {
            success: true,
            user: user || data.user,
            token: data.session.access_token,
            session: data.session,
          };
        }
      } catch (sbErr) {
        if (sbErr.isEmailUnconfirmed) throw sbErr;
        console.warn('[AuthContext] Supabase password signin notice:', sbErr.message);
      }
    }

    // 2. Fallback to Express backend API authentication
    const res = await api.login({ email: targetEmail || credentials?.email, username: cleanUsername, password: targetPassword });
    if (res.success && res.token) {
      localStorage.setItem('herearn_jwt_token', res.token);
      localStorage.setItem('herearn_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const { name, email, password, username, skillInterest, role } = userData || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim() || cleanEmail.split('@')[0] || 'Learner';
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : 'https://herearn.vercel.app/';

    // 1. Sign up user via Supabase Auth with email confirmation redirect
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          name: cleanName,
          username: username || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          skill_interest: skillInterest || 'Digital Marketing',
          role: role || 'learner',
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        throw new Error('Too many sign-up requests. Please wait a few minutes before trying again.');
      }
      if (msg.toLowerCase().includes('already registered')) {
        throw new Error(`An account with email "${cleanEmail}" already exists. Please log in instead.`);
      }
      throw error;
    }

    // If identities is empty array, email is already registered in Supabase
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error(`An account with email "${cleanEmail}" is already registered. Please log in.`);
    }

    const needsEmailConfirmation = !data?.session;

    if (needsEmailConfirmation) {
      // Ensure no active user session remains active before confirmation
      setUser(null);
      setSession(null);
      setToken(null);
      localStorage.removeItem('herearn_jwt_token');
      localStorage.removeItem('herearn_user');
      try {
        await api.logout();
      } catch {}
    } else if (data?.session) {
      // Auto-confirmed session: register on backend DB and sync session
      try {
        await api.register({
          name: cleanName,
          email: cleanEmail,
          password,
          skills: [skillInterest || 'Digital Marketing'],
        });
      } catch (apiErr) {
        console.warn('[AuthContext] Backend register mirror notice:', apiErr.message);
      }
      await syncSupabaseSession(data.session);
    }

    return {
      success: true,
      user: data?.user,
      session: data?.session,
      needsEmailConfirmation,
      email: cleanEmail,
      message: needsEmailConfirmation
        ? `Confirmation email sent to ${cleanEmail}. Please check your inbox and confirm your account.`
        : 'Account created successfully!',
    };
  };

  const resendConfirmationEmail = async (targetEmail) => {
    const cleanEmail = (targetEmail || '').trim().toLowerCase();
    if (!cleanEmail) throw new Error('Email address is required.');

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : 'https://herearn.vercel.app/';

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        throw new Error('Please wait 60 seconds before requesting another confirmation email.');
      }
      throw error;
    }

    return true;
  };

  const googleLogin = async (credential) => {
    const res = await api.googleLogin(credential);
    if (res && res.success && res.token) {
      localStorage.setItem('herearn_jwt_token', res.token);
      localStorage.setItem('herearn_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res?.message || 'Google sign-in failed');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Auth] Supabase signOut notice:', err?.message);
    }
    try {
      await api.logout();
    } catch (err) {
      console.warn('[Auth] Backend logout notice:', err?.message);
    }
    localStorage.removeItem('herearn_jwt_token');
    localStorage.removeItem('herearn_user');
    sessionStorage.removeItem('herearn_admin_token');
    sessionStorage.removeItem('herearn_admin_authenticated');
    setToken(null);
    setSession(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('herearn_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        isAuthenticated: !!user,
        loading,
        signInWithGoogle,
        login,
        register,
        resendConfirmationEmail,
        googleLogin,
        logout,
        updateUserProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || {};
};
