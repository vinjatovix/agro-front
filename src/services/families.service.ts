import type { PaginatedResponse } from '../types/api';
import type { Family } from '../types/Family';
import { apiFetch } from './api';

export async function getFamilies() {
  return apiFetch<PaginatedResponse<Family>>(
    '/api/v1/families?pagination[limit]=100&sort[name]=asc'
  );
}

export async function getFamilyById(idOrSlug: string) {
  return apiFetch<Family>(`/api/v1/families/${idOrSlug}`);
}
