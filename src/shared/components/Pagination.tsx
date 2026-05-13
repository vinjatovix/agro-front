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
    <div className="pagination">
      {pages.map((p) => {
        if (p === '...') {
          const key = `ellipsis-${ellipsisCount++}`;

          return (
            <span key={key} style={{ padding: '0 8px' }}>
              ...
            </span>
          );
        }

        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={p === currentPage}
            style={{
              fontWeight: p === currentPage ? 'bold' : 'normal',
              margin: '0 4px'
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
