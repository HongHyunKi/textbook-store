"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";

const MIN_PASSWORD_LENGTH = 6;

// 화면 확인용 샘플. 링크 확인과 비밀번호 변경 요청은 보내지 않는다.
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState<"ready" | "saving" | "done">("ready");

  const isMismatch = passwordConfirm !== "" && password !== passwordConfirm;
  const canSubmit =
    password.length >= MIN_PASSWORD_LENGTH && password === passwordConfirm && status !== "saving";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    // TODO: 복구 링크 확인(checking/invalid)과 비밀번호 변경 연동 (docs/designs/password-reset.md)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("done");
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center px-4 py-[80px]">
        <div className="w-full max-w-[400px]">
          {status === "done" ? (
            <div role="status" className="text-center">
              <h1 className="text-body-lg text-text-dark">비밀번호를 바꿨어요</h1>
              <p className="mt-2 text-body-sm text-text-secondary">
                새 비밀번호로 로그인해 주세요.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-body-lg text-text-dark">새 비밀번호 설정</h1>
              <p className="mt-2 text-body-sm text-text-secondary">
                {MIN_PASSWORD_LENGTH}자 이상의 새 비밀번호를 입력해 주세요.
              </p>
              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
                <div>
                  <label htmlFor="reset-password-new" className="text-body-sm text-text-dark">
                    새 비밀번호
                  </label>
                  <input
                    id="reset-password-new"
                    type="password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark"
                  />
                </div>
                <div>
                  <label htmlFor="reset-password-confirm" className="text-body-sm text-text-dark">
                    새 비밀번호 확인
                  </label>
                  <input
                    id="reset-password-confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    className="mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark"
                  />
                  {isMismatch && (
                    <p className="mt-1 text-body-sm text-discount-alternate">
                      비밀번호가 일치하지 않아요.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-[48px] rounded-base bg-primary text-body text-background disabled:opacity-40"
                >
                  {status === "saving" ? "저장하는 중..." : "비밀번호 변경"}
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
