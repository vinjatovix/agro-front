import type {
  ActivateAccountData,
  AuthenticateWithGoogleData,
  AuthTokenResponse,
  LoginCredentials,
  RegisterData
} from '../types/auth';
import { apiFetch } from './api';

export interface AuthServiceContract {
  register(dto: RegisterData): Promise<void>;
  activate(dto: ActivateAccountData): Promise<void>;
  login(dto: LoginCredentials): Promise<AuthTokenResponse>;
  authenticateWithGoogle(
    dto: AuthenticateWithGoogleData
  ): Promise<AuthTokenResponse>;
  refreshToken(): Promise<AuthTokenResponse>;
}

export async function register(dto: RegisterData): Promise<void> {
  return apiFetch<void>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto)
  });
}

export async function activate(dto: ActivateAccountData): Promise<void> {
  return apiFetch<void>('/api/v1/auth/activate', {
    method: 'POST',
    body: JSON.stringify(dto)
  });
}

export async function login(dto: LoginCredentials): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto)
  });
}

export async function authenticateWithGoogle(
  dto: AuthenticateWithGoogleData
): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>('/api/v1/auth/google', {
    method: 'POST',
    body: JSON.stringify(dto)
  });
}

export async function refreshToken(): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>('/api/v1/auth/refresh', {
    method: 'POST'
  });
}

export const authService: AuthServiceContract = {
  register,
  activate,
  login,
  authenticateWithGoogle,
  refreshToken
};
