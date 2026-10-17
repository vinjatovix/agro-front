export type UserRole = 'admin' | 'user';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly roles: readonly UserRole[];
}

export interface JwtPayload {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly roles: readonly UserRole[];
  readonly iat: number;
  readonly exp: number;
}

export interface AuthSession {
  readonly token: string;
  readonly user: AuthUser;
  readonly expiresAt: number;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterData {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly repeatPassword: string;
}

export interface ActivateAccountData {
  readonly token: string;
}

export interface ForgotPasswordData {
  readonly email: string;
}

export interface ResetPasswordData {
  readonly token: string;
  readonly password: string;
  readonly repeatPassword: string;
}

export interface AuthenticateWithGoogleData {
  readonly idToken: string;
}

export interface AuthTokenResponse {
  readonly token: string;
}

export interface UpdatePasswordData {
  readonly oldPassword: string;
  readonly password: string;
  readonly repeatPassword: string;
}

export interface UpdatePasswordResponse {
  readonly message: string;
}
