import { createContext, useContext, useState, type ReactNode } from 'react';

type User = {
  firstName: string;
  initials: string;
  email: string;
  hasNotification: boolean;
  certificatesCount: number;
  skillsCount: number;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  signup: (firstName: string, lastName: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // Generate simple name from email or default to Nounga
    const parts = email.split('@')[0];
    const name = parts.charAt(0).toUpperCase() + parts.slice(1);
    const initials = name.substring(0, 2).toUpperCase();
    setUser({
      firstName: name || 'Nounga',
      initials: initials || 'NJ',
      email,
      hasNotification: true,
      certificatesCount: 0,
      skillsCount: 0,
    });
  };

  const signup = (firstName: string, lastName: string, email: string) => {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    setUser({
      firstName,
      initials: initials || 'NJ',
      email,
      hasNotification: true,
      certificatesCount: 0,
      skillsCount: 0,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
