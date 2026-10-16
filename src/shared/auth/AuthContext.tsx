import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

import {
  activate as serviceActivate,
  authenticateWithGoogle as serviceGoogleLogin,
  login as serviceLogin,
  refreshToken as serviceRefreshToken,
  register as serviceRegister
} from '../../services/auth.service';
import type {
  ActivateAccountData,
  AuthenticateWithGoogleData,
  AuthSession,
  LoginCredentials,
  RegisterData
} from '../../types/auth';
import { ApiError } from '../errors/ApiError';
import { AuthContext, type AuthContextValue } from './authContextDef';
import {
  buildSessionFromToken,
  clearStoredToken,
  getInitialSession,
  setStoredToken,
  subscribeToSessionPurge,
  TOKEN_REFRESH_MARGIN_MS
} from './session';

const MAX_TIMEOUT_DELAY_MS = 2_147_483_647;

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(getInitialSession);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = useCallback(() => {
    clearStoredToken();
    setSession(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await serviceLogin(credentials);
      const nextSession = buildSessionFromToken(response.token);
      if (!nextSession) {
        clearStoredToken();
        throw new Error('Token de sesión no válido');
      }
      setStoredToken(response.token);
      setSession(nextSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (data: AuthenticateWithGoogleData) => {
    setIsLoading(true);
    try {
      const response = await serviceGoogleLogin(data);
      const nextSession = buildSessionFromToken(response.token);
      if (!nextSession) {
        clearStoredToken();
        throw new Error('Token de sesión no válido');
      }
      setStoredToken(response.token);
      setSession(nextSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await serviceRegister(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activate = useCallback(async (data: ActivateAccountData) => {
    setIsLoading(true);
    try {
      await serviceActivate(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return subscribeToSessionPurge(() => {
      setSession(null);
    });
  }, []);

  useEffect(() => {
    if (!session) return;

    const refreshTimestamp = session.expiresAt * 1000 - TOKEN_REFRESH_MARGIN_MS;
    const rawDelay = refreshTimestamp - Date.now();
    const delay = Math.min(Math.max(0, rawDelay), MAX_TIMEOUT_DELAY_MS);

    const timer = setTimeout(async () => {
      try {
        const response = await serviceRefreshToken();
        const nextSession = buildSessionFromToken(response.token);
        if (nextSession) {
          setStoredToken(response.token);
          setSession(nextSession);
        } else {
          logout();
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          logout();
        }
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [session, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      isAdmin: session?.user.roles.includes('admin') ?? false,
      isLoading,
      login,
      register,
      activate,
      googleLogin,
      logout
    }),
    [session, isLoading, login, register, activate, googleLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
