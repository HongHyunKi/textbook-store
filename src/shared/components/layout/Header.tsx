import Link from "next/link";

export function Header() {
  return (
    <header className="h-[100px] bg-background">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 md:gap-6 md:px-6 lg:px-[60px]">
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-tight text-primary md:text-lg lg:text-2xl"
        >
          HIDDEN KICE
        </Link>
        <nav
          aria-label="주 메뉴"
          className="hidden items-center gap-5 whitespace-nowrap text-body-sm-strong text-text-secondary md:flex lg:gap-10 lg:text-body-lg"
        >
          <Link href="/" aria-current="page" className="text-primary">
            스토어
          </Link>
          <a href="#" className="hover:text-text-dark">
            AI OMR WORK
          </a>
          <a href="#" className="hover:text-text-dark">
            챌린지
          </a>
          <a href="#" className="hover:text-text-dark">
            히든카이스 소개
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-4 text-icon-stroke lg:gap-6 [&_button:hover]:text-text-dark">
          <button
            type="button"
            aria-label="장바구니, 1개"
            className="relative flex h-6 w-[27px] items-start"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
              className="absolute -top-1.5 right-0 flex size-[15px] items-center justify-center rounded-pill bg-primary text-caption text-background"
            >
              1
            </span>
          </button>
          <button
            type="button"
            aria-label="알림, 1개"
            className="relative flex h-6 w-[27px] items-start"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute -top-1.5 right-0 flex size-[15px] items-center justify-center rounded-pill bg-primary text-caption text-background"
            >
              1
            </span>
          </button>
          <button
            type="button"
            aria-label="사용자"
            className="flex size-6 items-center justify-center"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
