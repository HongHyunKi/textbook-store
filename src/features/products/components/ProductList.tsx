"use client";

import { useState, type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api";
import { ProductCard } from "./ProductCard";
import { ProductToolbar } from "./ProductToolbar";
import { Pagination } from "@/shared/components/ui/Pagination";
import type { CategoryFilter } from "../types";
import { PAGE_SIZE, selectProducts } from "../utils";

export function ProductList(): JSX.Element {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const {
    data = [],
    isPending,
    isLoadingError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const filteredProducts = selectProducts(data, q, category);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeQuery(value: string) {
    setQ(value);
    setPage(1);
  }

  function changeCategory(value: CategoryFilter) {
    setCategory(value);
    setPage(1);
  }

  let content: JSX.Element;
  if (isPending) {
    content = (
      <div role="status">
        <span className="sr-only">교재를 불러오는 중입니다.</span>
        <ProductGridSkeleton />
      </div>
    );
  } else if (isLoadingError) {
    content = (
      <div className="py-24 text-center">
        <p role="alert" className="text-body text-text-dark">
          교재를 불러오지 못했습니다.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-4 rounded-base border border-border-secondary px-4 py-2 text-body-sm enabled:hover:bg-surface-muted disabled:opacity-50"
        >
          다시 시도
        </button>
      </div>
    );
  } else if (data.length === 0) {
    content = (
      <p role="status" className="py-24 text-center text-body text-text-secondary">
        등록된 교재가 없습니다
      </p>
    );
  } else if (filteredProducts.length === 0) {
    content = (
      <div className="py-24 text-center">
        <p role="status" className="text-body text-text-secondary">
          검색 결과가 없습니다
        </p>
        <button
          type="button"
          onClick={() => {
            changeQuery("");
            changeCategory("all");
          }}
          className="mt-4 rounded-base border border-border-secondary px-4 py-2 text-body-sm hover:bg-surface-muted"
        >
          검색 초기화
        </button>
      </div>
    );
  } else {
    content = (
      <div className={GRID_CLASS}>
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <>
      <ProductToolbar
        q={q}
        category={category}
        onQueryChange={changeQuery}
        onCategoryChange={changeCategory}
      />
      {/* 결과가 줄어도 검색창 아래가 최소 한 화면을 채워, 푸터가 화면 안으로 당겨 올라오는 레이아웃 이동(CLS)을 막는다 */}
      <div className="min-h-svh">{content}</div>
      <div className="mt-[46px] min-h-10">
        {!isPending && filteredProducts.length > 0 && (
          <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        )}
      </div>
    </>
  );
}

// xl: 피그마 기준 250px 카드 4개를 1280px 안에 space-between으로 배치, 행 간격 36px
const GRID_CLASS =
  "grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 xl:grid-cols-[repeat(4,250px)] xl:justify-between";

// ProductCard와 같은 이미지 비율·타이포그래피(줄 높이)로 그려 실제 카드와 높이를 맞춘다.
function ProductGridSkeleton() {
  const bar = "inline-block rounded-base bg-surface-muted";
  return (
    <div aria-hidden="true" className={`${GRID_CLASS} animate-pulse motion-reduce:animate-none`}>
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div key={index}>
          <div className="aspect-[250/320] rounded-base bg-surface-muted" />
          <p className="mt-1 text-body">
            <span className={`${bar} w-8`}>&nbsp;</span>
          </p>
          <p className="min-h-[2lh] text-body xl:min-h-0">
            <span className={`${bar} w-4/5`}>&nbsp;</span>
          </p>
          <div className="mt-2 text-body">
            <p className="text-body-sm">
              <span className={`${bar} w-1/3`}>&nbsp;</span>
            </p>
            <p>
              <span className={`${bar} w-1/2`}>&nbsp;</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
