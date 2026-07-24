import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

type User = {
  firstName: string;
  lastName?: string;
  initials: string;
  email: string;
  dob?: string;
  careerStatus?: string;
  hasNotification: boolean;
  certificatesCount: number;
  skillsCount: number;
  profileStrength: number;
  completedSurveys: string[];
  activePath: {
    categoryKey: string;
    taskIndex: number;
    stepIndex: number;
  } | null;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password?: string, dob?: string, status?: string) => Promise<void>;
  logout: () => void;
  completeSurvey: (pathId: string) => void;
  updateActivePath: (categoryKey: string | null, taskIndex?: number, stepIndex?: number) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  completeSurvey: () => {},
  updateActivePath: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('careerpath_user');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password?: string) => {
    try {
      const response = await api.post('/v1/web-auth/login', { identifier: email, password: password || 'default' });
      const apiUser = response.data.user;
      const token = response.data.token;
      
      const parts = email.split('@')[0];
      const name = apiUser?.fullName || parts.charAt(0).toUpperCase() + parts.slice(1);
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      const initials = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase() || 'U';
      
      const userData = {
        firstName,
        lastName,
        initials,
        email,
        dob: response.data.user.dob,
        careerStatus: response.data.user.careerStatus,
        hasNotification: true,
        certificatesCount: 0,
        skillsCount: 0,
        profileStrength: 65,
        completedSurveys: [],
        activePath: null,
      };

      localStorage.setItem('careerpath_token', token);
      localStorage.setItem('careerpath_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password?: string, dob?: string, status?: string) => {
    try {
      const response = await api.post('/v1/web-auth/signup', { firstName, lastName, email, password, dob, status });
      const apiUser = response.data.user;
      const token = response.data.token;

      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      const userData = {
        firstName,
        lastName,
        initials: initials || 'NJ',
        email,
        dob: apiUser.dob,
        careerStatus: apiUser.careerStatus,
        hasNotification: true,
        certificatesCount: 0,
        skillsCount: 0,
        profileStrength: 25,
        completedSurveys: [],
        activePath: null,
      };

      localStorage.setItem('careerpath_token', token);
      localStorage.setItem('careerpath_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('careerpath_token');
    localStorage.removeItem('careerpath_user');
    setUser(null);
  };

  const completeSurvey = (pathId: string) => {
    if (user && !user.completedSurveys.includes(pathId)) {
      const updatedUser = { ...user, completedSurveys: [...user.completedSurveys, pathId] };
      localStorage.setItem('careerpath_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updateActivePath = (categoryKey: string | null, taskIndex = 0, stepIndex = 0) => {
    if (user) {
      let updatedUser;
      if (categoryKey) {
        updatedUser = { ...user, activePath: { categoryKey, taskIndex, stepIndex } };
      } else {
        updatedUser = { ...user, activePath: null };
      }
      localStorage.setItem('careerpath_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  useEffect(() => {
    const refreshUser = async () => {
      const token = localStorage.getItem('careerpath_token');
      if (!token) return;
      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.user) {
          const apiUser = response.data.user;
          const name = apiUser.fullName || 'User';
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          const initials = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase() || 'U';
          
          const userData = {
            firstName,
            lastName,
            initials,
            email: apiUser.email,
            dob: apiUser.dob,
            careerStatus: apiUser.careerStatus,
            hasNotification: true,
            certificatesCount: 0,
            skillsCount: 0,
            profileStrength: 65,
            completedSurveys: [],
            activePath: null,
          };
          localStorage.setItem('careerpath_user', JSON.stringify(userData));
          setUser(userData);
        } else {
          setUser(null);
          localStorage.removeItem('careerpath_token');
          localStorage.removeItem('careerpath_user');
        }
      } catch (error: any) {
        console.error("Failed to refresh user", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setUser(null);
          localStorage.removeItem('careerpath_token');
          localStorage.removeItem('careerpath_user');
        }
      }
    };
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, completeSurvey, updateActivePath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
