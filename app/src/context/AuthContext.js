import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { getMediaUrl, setAuthToken } from '../services/api';
import { requestStartupPermissions } from '../services/permissions';

const AuthContext = createContext();

// Simple fallback storage for when AsyncStorage fails
const fallbackStorage = {};

const storeToken = async (key, value) => {
  try {
    if (value) {
      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    // Fallback to memory storage
    if (value) {
      fallbackStorage[key] = typeof value === 'string' ? value : JSON.stringify(value);
    } else {
      delete fallbackStorage[key];
    }
  }
};

const getStoredToken = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return fallbackStorage[key] || null;
  }
};

const normalizeUser = (value) => {
  if (!value) return value;
  return {
    ...value,
    avatar: getMediaUrl(value.avatar),
    providerProfile: value.providerProfile ? {
      ...value.providerProfile,
      avatar: getMediaUrl(value.providerProfile.avatar),
    } : value.providerProfile,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore token from AsyncStorage on app startup
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const storedToken = await getStoredToken('authToken');
        const storedUserStr = await getStoredToken('authUser');
        
        if (storedToken && storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          setToken(storedToken);
          setUser(normalizeUser(storedUser));
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.log('Error restoring token:', error);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreToken();
  }, []);

  // Persist token to AsyncStorage when it changes
  useEffect(() => {
    if (token && user) {
      storeToken('authToken', token);
      storeToken('authUser', user);
      setAuthToken(token);
      requestStartupPermissions().catch((error) => {
        console.log('Startup permissions skipped:', error.message);
      });
    } else if (!token && !user && !isRestoring) {
      storeToken('authToken', null);
      storeToken('authUser', null);
    }
  }, [token, user, isRestoring]);

  const loginWithOTP = async (email, phone, otp) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, phone, otp });
      setUser(normalizeUser(res.data.user));
      setToken(res.data.token);
      setHasLoggedOut(false);
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDirect = (userData, userToken) => {
    // Set token immediately in API headers
    setAuthToken(userToken);
    setUser(normalizeUser(userData));
    setToken(userToken);
    setHasLoggedOut(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setHasLoggedOut(true);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/users/profile', updates);
      setUser(normalizeUser(res.data.data));
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const uploadFile = async (formData, endpoint = '/upload') => {
    try {
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading,
      isRestoring,
      loginWithOTP, 
      loginDirect,
      logout, 
      updateProfile, 
      uploadFile,
      hasLoggedOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
