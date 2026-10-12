import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('herearn_jwt_token'));
  const [loading, setLoading] = useState(true);

  // Auto login on mount: check server session via HttpOnly cookie or token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          if (res.token) {
            setToken(res.token);
            localStorage.setItem('herearn_jwt_token', res.token);
          }
          localStorage.setItem('herearn_user', JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        // Fallback to stored token if offline or cookie not set
        const storedToken = localStorage.getItem('herearn_jwt_token');
        if (storedToken) {
          try {
            const res = await api.getMe();
            if (res.success && res.user) {
              setUser(res.user);
            } else {
              logout();
            }
          } catch {
            // Keep local state if disconnected
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

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
      await api.logout();
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('herearn_jwt_token');
    localStorage.removeItem('herearn_user');
    setToken(null);
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
        token,
        isAuthenticated: !!user,
        loading,
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

