import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isRestoring: boolean;
  login: (email: string, phone: string, password: string) => Promise<any>;
  register: (payload: Record<string, unknown>) => Promise<any>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<any>;
  uploadFile: (formData: FormData) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsRestoring(false);
      return;
    }

    let cancelled = false;
    setIsRestoring(true);

    api
      .get('/users/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const payload = email ? { email, password } : { phone, password };
      const res = await api.post('/auth/login', payload);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await api.put('/users/profile', updates);
    setUser(res.data.data);
    return res.data;
  };

  const uploadFile = async (formData: FormData) => {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isRestoring,
        login,
        register,
        logout,
        updateProfile,
        uploadFile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
