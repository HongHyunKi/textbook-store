import type { CategoryFilter, Product } from "./types";

export const PAGE_SIZE = 12;

export function selectProducts(list: Product[], q: string, category: CategoryFilter): Product[] {
  const query = q.trim().toLowerCase();

  return list.filter(
    (product) =>
      product.title.toLowerCase().includes(query) &&
      (category === "all" || product.category === category),
  );
}
