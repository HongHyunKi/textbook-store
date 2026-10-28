"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";

// 화면 확인용 샘플. 실제 재설정 요청은 보내지 않는다.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    // TODO: 비밀번호 재설정 요청 연동
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("sent");
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center px-4 py-[80px]">
        <div className="w-full max-w-[400px]">
          {status === "sent" ? (
            <div role="status" className="text-center">
              <h1 className="text-body-lg text-text-dark">메일을 확인해 주세요</h1>
              <p className="mt-2 text-body-sm text-text-secondary">
                입력한 이메일로 재설정 안내를 보냈어요
                <br />
                메일이 오지 않으면 잠시 후 다시 시도해 주세요.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 h-[48px] w-full rounded-base border border-border-secondary text-body text-text-dark"
              >
                다른 이메일로 다시 받기
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-body-lg text-text-dark">비밀번호 찾기</h1>
              <p className="mt-2 text-body-sm text-text-secondary">
                가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
              </p>
              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
                <div>
                  <label htmlFor="forgot-password-email" className="text-body-sm text-text-dark">
                    이메일
                  </label>
                  <input
                    id="forgot-password-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setIsEmailValid(event.target.validity.valid);
                    }}
                    placeholder="example@email.com"
                    className="mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark placeholder:text-text-secondary"
                  />
                  {email && !isEmailValid && (
                    <p className="mt-1 text-body-sm text-discount-alternate">
                      이메일 형식이 올바르지 않아요.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!isEmailValid || status === "loading"}
                  className="h-[48px] rounded-base bg-primary text-body text-background disabled:opacity-40"
                >
                  {status === "loading" ? "보내는 중..." : "재설정 링크 받기"}
                </button>
              </form>
            </>
          )}
          <Link
            href="/"
            className="mt-6 block text-center text-body-sm text-text-secondary hover:text-text-dark"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
