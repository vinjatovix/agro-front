interface Props {
  pages: (number | '...')[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pages,
  currentPage,
  onPageChange
}: Props) {
  return (
    <div className="pagination">
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 8px' }}>
            ...
          </span>
        ) : (
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
        )
      )}
    </div>
  );
}
