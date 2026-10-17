import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { Family, FamilyListItem } from '../types/Family';
import { apiFetch } from './api';
import {
  FAMILY_FIELDS_QUERY_KEY,
  FAMILY_LIST_FIELDS,
  FAMILY_LIST_SORT_DIRECTION,
  FAMILY_SORT_QUERY_KEYS
} from './familyListQuery';
import { PAGINATION_LIMIT_MAX, PAGINATION_QUERY_KEYS } from './listQuery';

const FIRST_PAGE = 1;

function getFamilyListPage(
  page: number
): Promise<PaginatedResponse<FamilyListItem>> {
  const query = QueryBuilder.create()
    .add(PAGINATION_QUERY_KEYS.page, page)
    .add(PAGINATION_QUERY_KEYS.limit, PAGINATION_LIMIT_MAX)
    .add(FAMILY_SORT_QUERY_KEYS.name, FAMILY_LIST_SORT_DIRECTION)
    .add(FAMILY_FIELDS_QUERY_KEY, FAMILY_LIST_FIELDS.join(','))
    .build();

  return apiFetch(`/api/v1/families?${query}`);
}

function pagesAfterFirst(totalPages: number): number[] {
  return Array.from(
    { length: Math.max(totalPages - FIRST_PAGE, 0) },
    (_, index) => FIRST_PAGE + index + 1
  );
}

export async function getFamilyList(): Promise<FamilyListItem[]> {
  const firstPage = await getFamilyListPage(FIRST_PAGE);
  const otherPages = await Promise.all(
    pagesAfterFirst(firstPage.pagination.totalPages).map(getFamilyListPage)
  );

  return [firstPage, ...otherPages].flatMap((page) => page.data);
}

export async function getFamilyById(idOrSlug: string) {
  return apiFetch<Family>(`/api/v1/families/${idOrSlug}`);
}
