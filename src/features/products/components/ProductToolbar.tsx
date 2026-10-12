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
    <div className="mb-8 flex flex-col items-end justify-end gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative w-full sm:w-60">
        <label htmlFor="product-search" className="sr-only">
          교재명 검색
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="pointer-events-none absolute top-3 left-3 size-4 text-gray-500"
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
          className="h-10 w-full rounded border border-line pr-10 pl-9 text-sm [&::-webkit-search-cancel-button]:appearance-none"
        />
        {q && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => {
              onQueryChange("");
              document.getElementById("product-search")?.focus();
            }}
            className="absolute top-0 right-0 flex size-10 items-center justify-center text-xl text-gray-500"
          >
            ×
          </button>
        )}
      </div>
      <div role="group" aria-label="교재 카테고리" className="flex shrink-0 items-center text-sm">
        {categories.map(({ value, label }, index) => (
          <span key={value} className="flex items-center">
            {index > 0 && <span aria-hidden="true" className="mx-3 text-gray-300">|</span>}
            <button
              type="button"
              aria-pressed={category === value}
              onClick={() => onCategoryChange(value)}
              className={`py-2 ${category === value ? "font-bold text-gray-900" : "text-gray-500"}`}
            >
              {label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
