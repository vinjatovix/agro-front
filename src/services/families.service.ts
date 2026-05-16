import { apiFetch } from './api';

export async function getFamilies() {
  return apiFetch('/api/v1/families?pagination[limit]=100&sort[name]=asc');
}

export async function getFamilyById(idOrSlug: string) {
  return apiFetch(`/api/v1/families/${idOrSlug}`);
}
