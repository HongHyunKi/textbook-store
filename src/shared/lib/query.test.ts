import { describe, expect, it } from "vitest";
import { escapeLikePattern, pageToRange } from "./query";

describe("pageToRange", () => {
  it("페이지 번호를 양끝 포함 행 범위로 바꾼다", () => {
    expect(pageToRange(1, 12)).toEqual([0, 11]);
    expect(pageToRange(3, 12)).toEqual([24, 35]);
    expect(pageToRange(2, 5)).toEqual([5, 9]);
  });

  it("1보다 작거나 소수인 페이지는 보정한다", () => {
    expect(pageToRange(0, 12)).toEqual([0, 11]);
    expect(pageToRange(-3, 12)).toEqual([0, 11]);
    expect(pageToRange(2.7, 12)).toEqual([12, 23]);
  });
});

describe("escapeLikePattern", () => {
  it("LIKE 와일드카드와 이스케이프 문자를 이스케이프한다", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
    expect(escapeLikePattern("a_b")).toBe("a\\_b");
    expect(escapeLikePattern("c:\\d")).toBe("c:\\\\d");
  });

  it("일반 검색어는 그대로 둔다", () => {
    expect(escapeLikePattern("2026 Hidden Kice 국어")).toBe("2026 Hidden Kice 국어");
  });
});
