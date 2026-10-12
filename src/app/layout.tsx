import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "히든카이스 스토어",
  description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} font-sans antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
