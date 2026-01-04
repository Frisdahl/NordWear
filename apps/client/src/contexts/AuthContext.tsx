import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, apiClient } from '../services/api';

// Define the shape of the user object
interface AuthUser {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  // Setup Axios interceptor to handle 401 responses globally
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url;
          // Ignore 401s from check-auth (getMe) and logout endpoints to avoid redirect loops or unwanted redirects on public load
          if (url && !url.includes('/auth/me') && !url.includes('/logout')) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (user) {
        inactivityTimer = setTimeout(() => {
          console.log("User inactive, logging out...");
          logout();
        }, INACTIVITY_TIMEOUT);
      }
    };

    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [user, logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Always try to fetch current user from server to validate cookie
        const response = await getMe();
        if (response && response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        // If 401 or other error, clear local state
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
