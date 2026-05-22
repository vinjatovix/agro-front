import { iconsMap } from '../../constants/iconsMap';

import './pagination.css';

interface Props {
  readonly pages: (number | '...')[];
  readonly currentPage: number;
  readonly onPageChange: (page: number) => void;
}

export default function Pagination({
  pages,
  currentPage,
  onPageChange
}: Props) {
  let ellipsisCount = 0;

  return (
    <nav className="pagination" aria-label="Pagination">
      {pages.map((p) => {
        if (p === '...') {
          const key = `ellipsis-${ellipsisCount++}`;

          return (
            <span key={key} className="pagination__ellipsis">
              {iconsMap.ellipsis}
            </span>
          );
        }

        const isActive = p === currentPage;

        return (
          <button
            key={p}
            type="button"
            data-testid={`pagination-button-${p}`}
            className={`pagination__button ${
              isActive ? 'pagination__button--active' : ''
            }`}
            onClick={() => onPageChange(p)}
            disabled={isActive}
            aria-current={isActive ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}
    </nav>
  );
}
