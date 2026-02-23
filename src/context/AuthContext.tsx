import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
  walletAddress?: string;
  avatar?: string;
  points?: number;
  isAccessGranted?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      // Trust stored data immediately so user isn't logged out on refresh
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoading(false);

      // Then silently validate in background & refresh user data
      validateTokenInBackground(storedToken, JSON.parse(storedUser));
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateTokenInBackground = async (storedToken: string, storedUser: User) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/v1/me`, {
        headers: { 'Authorization': `Bearer ${storedToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const freshUser = data.user || storedUser;
        setUser(freshUser);
        localStorage.setItem('auth_user', JSON.stringify(freshUser));
      } else if (response.status === 401 || response.status === 403) {
        // Token truly expired — clear session
        console.log('[Auth] Token expired, clearing session');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      }
      // Other errors (500, network) — keep the session, don't log out
    } catch {
      // Network error — keep session (offline-friendly)
    }
  };

  // Global interceptor: auto-logout on 401/403 from API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const isApiCall = url.includes(API_URL) || url.startsWith('/api');
      // Skip auth endpoints AND /me (used for validation above)
      const isSkipped = url.includes('/login') || url.includes('/register') || url.includes('/wallet-login') || url.includes('/wallet-register') || url.endsWith('/me');

      if (isApiCall && !isSkipped && (response.status === 401 || response.status === 403)) {
        console.log('[Auth] Received', response.status, '- auto-logging out');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
        if (!prev) return null;
        const newUser = { ...prev, ...updatedUser };
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
