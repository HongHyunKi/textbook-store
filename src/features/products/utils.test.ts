import { describe, expect, it } from "vitest";
import type { Product } from "./types";
import { selectProducts } from "./utils";

const products: Product[] = [
  {
    id: "3",
    title: "2026 Hidden Kice 국어",
    category: "single",
    image_url: "/products/single.png",
    price: 40000,
    original_price: null,
    discount_rate: null,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "1",
    title: "2026 hidden kice 국어 패스",
    category: "pass",
    image_url: "/products/pass.png",
    price: 64800,
    original_price: 76000,
    discount_rate: 5,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "2",
    title: "2026 HIDDEN KICE 수학",
    category: "single",
    image_url: "/products/single.png",
    price: 35000,
    original_price: null,
    discount_rate: null,
    created_at: "2026-01-03T00:00:00Z",
  },
];

describe("selectProducts", () => {
  it("검색어 앞뒤 공백과 대소문자를 무시한다", () => {
    expect(selectProducts(products, "  hIdDeN KiCe  ", "all")).toEqual(products);
    expect(selectProducts(products, " \t ", "all")).toEqual(products);
  });

  it("일치하는 상품이 없으면 빈 배열을 반환한다", () => {
    expect(selectProducts(products, "없는 교재", "all")).toEqual([]);
    expect(selectProducts([], "", "all")).toEqual([]);
  });

  it("선택한 카테고리의 상품만 반환한다", () => {
    expect(selectProducts(products, "", "single")).toEqual([products[0], products[2]]);
    expect(selectProducts(products, "", "pass")).toEqual([products[1]]);
  });

  it("검색어와 카테고리를 함께 적용한다", () => {
    expect(selectProducts(products, "국어", "single")).toEqual([products[0]]);
    expect(selectProducts(products, "수학", "pass")).toEqual([]);
  });

  it("입력 순서를 유지하고 원본 배열을 변경하지 않는다", () => {
    const original = [...products];

    expect(selectProducts(products, "hidden", "single").map((product) => product.id)).toEqual([
      "3",
      "2",
    ]);
    expect(products).toEqual(original);
  });
});
