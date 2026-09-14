import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  type ReactElement,
  useContext,
  useState,
  type PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { authService } from '~/services/auth.service';
import { isTokenExpired } from '~/utils/token.util';

interface AuthUser {
  id: string;
  name: string;
  role: string;
  departmentId?: string;
}

interface DecodedToken {
  sub: string;
  name: string;
  role: string;
  departmentId?: string;
  exp: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeUser = (accessToken: string): AuthUser => {
  const decoded = jwtDecode<DecodedToken>(accessToken);

  return {
    id: decoded.sub,
    name: decoded.name,
    role: decoded.role,
    departmentId: decoded.departmentId,
  };
};

const clearStoredTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const AuthProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async (): Promise<void> => {
      const savedAccessToken = localStorage.getItem('access_token');
      const savedRefreshToken = localStorage.getItem('refresh_token');

      if (!savedAccessToken || !savedRefreshToken) {
        setIsInitializing(false);
        return;
      }

      if (!isTokenExpired(savedAccessToken)) {
        try {
          setUser(decodeUser(savedAccessToken));
        } catch {
          clearStoredTokens();
          setUser(null);
        }
        setIsInitializing(false);
        return;
      }

      try {
        const { accessToken, refreshToken } = await authService.refresh(
          savedRefreshToken
        );

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setUser(decodeUser(accessToken));
      } catch {
        clearStoredTokens();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    void initializeAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { accessToken, refreshToken } = await authService.login(
        username,
        password
      );

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setUser(decodeUser(accessToken));

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);

      return false;
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isInitializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
