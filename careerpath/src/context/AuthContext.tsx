import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../services/api';

type User = {
  firstName: string;
  lastName?: string;
  initials: string;
  email: string;
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
  signup: (firstName: string, lastName: string, email: string, password?: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password?: string) => {
    try {
      const response = await api.post('/web-auth/login', { identifier: email, password: password || 'default' });
      const apiUser = response.data.user;
      
      const parts = email.split('@')[0];
      const name = apiUser?.fullName || parts.charAt(0).toUpperCase() + parts.slice(1);
      const initials = name.substring(0, 2).toUpperCase();
      
      setUser({
        firstName: name,
        initials: initials,
        email,
        hasNotification: true,
        certificatesCount: 0,
        skillsCount: 0,
        profileStrength: 65,
        completedSurveys: [],
        activePath: null,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, _password?: string) => {
    try {
      // Mock API call for signup since it's not fully implemented on backend yet
      // await api.post('/web-auth/signup', { firstName, lastName, email, password });
      
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      setUser({
        firstName,
        lastName,
        initials: initials || 'NJ',
        email,
        hasNotification: true,
        certificatesCount: 0,
        skillsCount: 0,
        profileStrength: 25,
        completedSurveys: [],
        activePath: null,
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => setUser(null);

  const completeSurvey = (pathId: string) => {
    if (user && !user.completedSurveys.includes(pathId)) {
      setUser({ ...user, completedSurveys: [...user.completedSurveys, pathId] });
    }
  };

  const updateActivePath = (categoryKey: string | null, taskIndex = 0, stepIndex = 0) => {
    if (user) {
      if (categoryKey) {
        setUser({ ...user, activePath: { categoryKey, taskIndex, stepIndex } });
      } else {
        setUser({ ...user, activePath: null });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, completeSurvey, updateActivePath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
