// 1부터 시작하는 페이지 번호를 Supabase range의 [from, to](양끝 포함) 행 인덱스로 바꾼다.
export function pageToRange(page: number, pageSize: number): [number, number] {
  const from = (Math.max(1, Math.floor(page)) - 1) * pageSize;
  return [from, from + pageSize - 1];
}

// ilike 패턴에서 사용자가 입력한 %, _, \ 가 와일드카드로 해석되지 않게 이스케이프한다.
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}
