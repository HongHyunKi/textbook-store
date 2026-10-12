type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const buttonClass = "flex size-8 items-center justify-center rounded border text-sm disabled:cursor-default disabled:opacity-30";

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="페이지" className="mt-12 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${buttonClass} border-line text-gray-500`}
      >
        {"<"}
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          aria-label={`${number}페이지`}
          aria-current={page === number ? "page" : undefined}
          onClick={() => onPageChange(number)}
          className={`${buttonClass} ${page === number ? "border-brand-purple bg-brand-purple text-white" : "border-line text-gray-500"}`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className={`${buttonClass} border-line text-gray-500`}
      >
        {">"}
      </button>
    </nav>
  );
}
