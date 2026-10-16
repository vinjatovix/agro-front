import { createContext } from 'react';

import type {
  ActivateAccountData,
  AuthenticateWithGoogleData,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData
} from '../../types/auth';

export interface AuthContextValue {
  readonly session: AuthSession | null;
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isAdmin: boolean;
  readonly isLoading: boolean;
  login(credentials: LoginCredentials): Promise<void>;
  register(data: RegisterData): Promise<void>;
  activate(data: ActivateAccountData): Promise<void>;
  googleLogin(data: AuthenticateWithGoogleData): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
