import { CATEGORY_LABEL, type CategoryFilter } from "../types";

type ProductToolbarProps = {
  q: string;
  category: CategoryFilter;
  onQueryChange: (q: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
};

const categories = [
  { value: "all", label: "전체" },
  { value: "pass", label: CATEGORY_LABEL.pass },
  { value: "single", label: CATEGORY_LABEL.single },
] as const;

export function ProductToolbar({
  q,
  category,
  onQueryChange,
  onCategoryChange,
}: ProductToolbarProps) {
  return (
    <div className="mb-9 flex flex-col items-end justify-end gap-4 sm:flex-row sm:items-center sm:gap-[17px]">
      <div className="relative w-full sm:w-[250px]">
        <label htmlFor="product-search" className="sr-only">
          교재명 검색
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="pointer-events-none absolute top-[11px] left-2 size-5 text-icon-stroke"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          id="product-search"
          type="search"
          value={q}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="검색"
          className="h-[42px] w-full rounded-base border border-border-secondary pr-8 pl-[34px] text-body text-text-dark placeholder:text-text-secondary [&::-webkit-search-cancel-button]:appearance-none"
        />
        {q && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => {
              onQueryChange("");
              document.getElementById("product-search")?.focus();
            }}
            className="absolute top-0 right-0 flex h-[42px] w-8 items-center justify-center text-icon-stroke"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="size-4"
            >
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <div
        role="group"
        aria-label="교재 카테고리"
        className="flex shrink-0 items-center gap-[11px] text-body"
      >
        {categories.map(({ value, label }, index) => (
          <span key={value} className="flex items-center gap-[11px]">
            {index > 0 && (
              <span aria-hidden="true" className="text-text-secondary">
                |
              </span>
            )}
            <button
              type="button"
              aria-pressed={category === value}
              onClick={() => onCategoryChange(value)}
              className={
                category === value ? "text-text-dark" : "text-text-secondary hover:text-text-dark"
              }
            >
              {label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
