import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as apiModule from '../../src/services/api';
import {
  activate,
  authenticateWithGoogle,
  authService,
  login,
  refreshToken,
  register
} from '../../src/services/auth.service';

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('calls register endpoint with POST and DTO body', async () => {
      const apiFetchSpy = vi
        .spyOn(apiModule, 'apiFetch')
        .mockResolvedValueOnce(undefined);
      const dto = {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'hortelano@example.com',
        username: 'hortelano',
        password: 'Password1!',
        repeatPassword: 'Password1!'
      };

      await register(dto);

      expect(apiFetchSpy).toHaveBeenCalledWith('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(dto)
      });
    });
  });

  describe('activate', () => {
    it('calls activate endpoint with POST and token body', async () => {
      const apiFetchSpy = vi
        .spyOn(apiModule, 'apiFetch')
        .mockResolvedValueOnce(undefined);
      const dto = { token: 'activation-token-value' };

      await activate(dto);

      expect(apiFetchSpy).toHaveBeenCalledWith('/api/v1/auth/activate', {
        method: 'POST',
        body: JSON.stringify(dto)
      });
    });
  });

  describe('login', () => {
    it('calls login endpoint and returns token response', async () => {
      const apiFetchSpy = vi
        .spyOn(apiModule, 'apiFetch')
        .mockResolvedValueOnce({ token: 'jwt-token-response' });
      const dto = {
        email: 'hortelano@example.com',
        password: 'Password1!'
      };

      const result = await login(dto);

      expect(result).toEqual({ token: 'jwt-token-response' });
      expect(apiFetchSpy).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto)
      });
    });
  });

  describe('authenticateWithGoogle', () => {
    it('calls google auth endpoint and returns token response', async () => {
      const apiFetchSpy = vi
        .spyOn(apiModule, 'apiFetch')
        .mockResolvedValueOnce({ token: 'google-jwt-response' });
      const dto = { idToken: 'google-credential-id-token' };

      const result = await authenticateWithGoogle(dto);

      expect(result).toEqual({ token: 'google-jwt-response' });
      expect(apiFetchSpy).toHaveBeenCalledWith('/api/v1/auth/google', {
        method: 'POST',
        body: JSON.stringify(dto)
      });
    });
  });

  describe('refreshToken', () => {
    it('calls refresh endpoint with POST and returns token response', async () => {
      const apiFetchSpy = vi
        .spyOn(apiModule, 'apiFetch')
        .mockResolvedValueOnce({ token: 'refreshed-jwt-response' });

      const result = await refreshToken();

      expect(result).toEqual({ token: 'refreshed-jwt-response' });
      expect(apiFetchSpy).toHaveBeenCalledWith('/api/v1/auth/refresh', {
        method: 'POST'
      });
    });
  });

  describe('authService contract object', () => {
    it('exposes all contract methods', () => {
      expect(typeof authService.register).toBe('function');
      expect(typeof authService.activate).toBe('function');
      expect(typeof authService.login).toBe('function');
      expect(typeof authService.authenticateWithGoogle).toBe('function');
      expect(typeof authService.refreshToken).toBe('function');
    });
  });
});
