type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

// 피그마 pagination_item: 40×40, 모서리 6px, 1px primary 테두리. 현재 페이지는 primary 배경(filled)
const itemClass =
  "flex size-10 items-center justify-center rounded-base border border-primary text-body-sm disabled:opacity-40";
const outlineClass = `${itemClass} bg-background text-primary enabled:hover:bg-background-subtle`;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d={direction === "left" ? "m12.5 5-5 5 5 5" : "m7.5 5 5 5-5 5"} />
    </svg>
  );
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="페이지" className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={outlineClass}
      >
        <Chevron direction="left" />
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          aria-label={`${number}페이지`}
          aria-current={page === number ? "page" : undefined}
          onClick={() => onPageChange(number)}
          className={page === number ? `${itemClass} bg-primary text-background` : outlineClass}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className={outlineClass}
      >
        <Chevron direction="right" />
      </button>
    </nav>
  );
}
