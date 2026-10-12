export function Footer() {
  return (
    <footer className="border-t border-line text-xs leading-5 text-neutral-500">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-[60px]">
        <nav
          aria-label="회사 및 이용 안내"
          className="mb-3 flex flex-wrap items-center gap-x-3 text-neutral-600"
        >
          <a href="#">회사소개</a>
          <span aria-hidden="true">|</span>
          <a href="#">이용약관</a>
          <span aria-hidden="true">|</span>
          <a href="#" className="font-semibold">
            개인정보처리방침
          </a>
        </nav>
        <p>(주)히든카이스 | 대표: 안영호 | 사업자등록번호: 735-87-02522 (사업자정보확인)</p>
        <p className="break-words">
          주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업신고: 제 2024-고양일산서-1209 |
          이메일: Hidden_kice@naver.com
        </p>
        <p className="mt-2">Copyright © 2026 히든카이스. All rights reserved.</p>
      </div>
    </footer>
  );
}
