"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { getSupabase } from "@/shared/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    // 가입 여부와 관계없이 같은 결과를 보여줘 이메일 존재 여부가 드러나지 않게 한다.
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setStatus(error ? "error" : "sent");
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
              </p>
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
                {status === "error" && (
                  <p role="alert" className="text-body-sm text-discount-alternate">
                    요청을 보내지 못했어요. 잠시 후 다시 시도해 주세요.
                  </p>
                )}
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
