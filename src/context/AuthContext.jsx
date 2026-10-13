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
    const res = await api.login(credentials);
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
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('herearn_jwt_token', res.token);
      localStorage.setItem('herearn_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
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
