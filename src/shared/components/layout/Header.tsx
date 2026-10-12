export function Header() {
  return (
    <header className="h-[100px] bg-white">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 md:gap-6 md:px-6 lg:px-[60px]">
        <a
          href="#"
          className="shrink-0 text-xl font-black tracking-tight text-brand-purple md:text-lg lg:text-2xl"
        >
          HIDDEN KICE
        </a>
        <nav
          aria-label="주 메뉴"
          className="hidden items-center gap-5 whitespace-nowrap text-xs font-medium md:flex lg:gap-10 lg:text-base"
        >
          <a href="#" aria-current="page" className="font-bold text-brand-purple">
            스토어
          </a>
          <a href="#">AI OMR WORK</a>
          <a href="#">챌린지</a>
          <a href="#">히든카이스 소개</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1 lg:gap-3">
          <button
            type="button"
            aria-label="장바구니"
            className="relative flex size-9 items-center justify-center"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <path d="M3 4h2l2.5 11h11l2-8H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 size-1.5 rounded-full bg-brand-purple"
            />
          </button>
          <button
            type="button"
            aria-label="알림"
            className="relative flex size-9 items-center justify-center"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 size-1.5 rounded-full bg-brand-purple"
            />
          </button>
          <button
            type="button"
            aria-label="사용자"
            className="flex size-9 items-center justify-center"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="size-6"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
