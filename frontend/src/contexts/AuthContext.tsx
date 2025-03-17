import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        setUser(null);
        if (!router.pathname.includes('/login')) {
          router.replace('/login');
        }
        return;
      }

      // Validar token y usuario
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error('Error en checkAuth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: any) => {
    console.log('Login data:', userData); // Debug log
    if (userData.user && userData.access_token) {
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.access_token);
    } else {
      console.error('Datos de usuario inválidos:', userData);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
    }
    router.replace('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading: loading 
      }}
    >
      {!loading && children}
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
