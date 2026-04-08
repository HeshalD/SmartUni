/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auto-login if we are on the OAuth callback page
    // The callback page handles its own authentication
    if (window.location.pathname.includes('/oauth2/callback')) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        setUser(res.data);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await authApi.signup(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  }, []);

  const loginWithToken = useCallback(async () => {
    const res = await authApi.getMe();
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.getMe();
    setUser(res.data);
  }, []);

  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) ?? false;
  }, [user]);

  const isAdmin      = hasRole('ADMIN');
  const isTechnician = hasRole('TECHNICIAN');

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      signup,
      logout,
      loginWithToken,
      refreshUser,
      hasRole,
      isAdmin,
      isTechnician,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};