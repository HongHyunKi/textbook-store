import { getSupabase } from "@/lib/supabase";
import type { Product } from "./types";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("id,title,category,image_url,price,original_price,discount_rate,created_at")
    .order("created_at")
    .order("id");

  // supabase-js는 오류를 throw하지 않으므로 React Query에 직접 전달한다.
  if (error) throw error;

  return data ?? [];
}
