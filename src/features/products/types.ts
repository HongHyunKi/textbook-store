export type Category = "pass" | "single";
export type CategoryFilter = "all" | Category;

export const CATEGORY_LABEL: Record<Category, string> = { pass: "패스", single: "단품" };

export type Product = {
  id: string;
  title: string;
  category: Category;
  image_url: string;
  price: number;
  original_price: number | null;
  discount_rate: number | null;
  created_at: string;
};
