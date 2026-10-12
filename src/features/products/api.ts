import { escapeLikePattern, pageToRange } from "@/shared/lib/query";
import { getSupabase } from "@/shared/lib/supabase";
import type { CategoryFilter, Product } from "./types";

export const PAGE_SIZE = 12;

export type ProductsParams = {
  page: number;
  q: string;
  category: CategoryFilter;
};

export type ProductsPage = {
  items: Product[];
  total: number;
};

// 검색·카테고리 필터와 페이지 범위를 서버(Supabase)에서 적용하고, 전체 개수를 함께 받는다.
export async function fetchProducts({ page, q, category }: ProductsParams): Promise<ProductsPage> {
  const [from, to] = pageToRange(page, PAGE_SIZE);
  let query = getSupabase()
    .from("products")
    .select("id,title,category,image_url,price,original_price,discount_rate,created_at", {
      count: "exact",
    })
    .order("created_at")
    .order("id")
    .range(from, to);

  const keyword = q.trim();
  if (keyword) query = query.ilike("title", `%${escapeLikePattern(keyword)}%`);
  if (category !== "all") query = query.eq("category", category);

  const { data, count, error } = await query;

  // supabase-js는 오류를 throw하지 않으므로 React Query에 직접 전달한다.
  if (error) throw error;

  return { items: data ?? [], total: count ?? 0 };
}
