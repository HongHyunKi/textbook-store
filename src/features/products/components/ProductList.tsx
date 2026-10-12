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
  const { data = [], isPending, isLoadingError, isFetching, refetch } = useQuery({
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

  return (
    <>
      <ProductToolbar
        q={q}
        category={category}
        onQueryChange={changeQuery}
        onCategoryChange={changeCategory}
      />
      {isPending ? (
        <div role="status">
          <span className="sr-only">교재를 불러오는 중입니다.</span>
          <div aria-hidden="true" className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div key={index} className="animate-pulse motion-reduce:animate-none">
                <div className="aspect-[250/320] rounded-[6px] bg-gray-100" />
                <div className="mt-4 h-3 w-8 rounded bg-gray-100" />
                <div className="mt-2 h-5 w-4/5 rounded bg-gray-100" />
                <div className="mt-3 h-5 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ) : isLoadingError ? (
        <div className="py-24 text-center">
          <p role="alert" className="text-gray-600">교재를 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded border border-line px-4 py-2 text-sm disabled:opacity-50"
          >
            다시 시도
          </button>
        </div>
      ) : data.length === 0 ? (
        <p role="status" className="py-24 text-center text-gray-500">등록된 교재가 없습니다</p>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p role="status" className="text-gray-500">검색 결과가 없습니다</p>
          <button
            type="button"
            onClick={() => {
              changeQuery("");
              changeCategory("all");
            }}
            className="mt-4 rounded border border-line px-4 py-2 text-sm"
          >
            검색 초기화
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
