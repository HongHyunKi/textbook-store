"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { getSupabase } from "@/shared/lib/supabase";

// supabase/config.toml의 minimum_password_length와 맞춘다.
const MIN_PASSWORD_LENGTH = 6;

type Status = "checking" | "invalid" | "ready" | "loading" | "error" | "done";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState<Status>("checking");
  const [errorMessage, setErrorMessage] = useState("");

  // 메일 링크의 URL 해시에서 Supabase가 복구 세션을 만든 뒤 INITIAL_SESSION을 보낸다.
  // 기존 로그인 세션으로 바뀌지 않도록, 클라이언트가 해시를 지우기 전에 복구 링크인지 먼저 확인한다.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const isRecoveryLink = hash.get("type") === "recovery" && !hash.has("error");
    const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") setStatus(session && isRecoveryLink ? "ready" : "invalid");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const isTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const isMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const canSubmit =
    password.length >= MIN_PASSWORD_LENGTH && password === passwordConfirm && status !== "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const { error } = await getSupabase().auth.updateUser({ password });
    if (!error) {
      setStatus("done");
      return;
    }
    setErrorMessage(
      error.code === "same_password"
        ? "기존과 다른 비밀번호를 입력해 주세요."
        : error.code === "weak_password"
          ? "더 안전한 비밀번호를 입력해 주세요."
          : "비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
    setStatus("error");
  }

  const inputClassName =
    "mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark placeholder:text-text-secondary";

  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center px-4 py-[80px]">
        <div className="w-full max-w-[400px]">
          {status === "checking" ? (
            <p role="status" className="text-center text-body-sm text-text-secondary">
              링크를 확인하는 중...
            </p>
          ) : status === "invalid" ? (
            <div role="alert" className="text-center">
              <h1 className="text-body-lg text-text-dark">링크가 만료됐어요</h1>
              <p className="mt-2 text-body-sm text-text-secondary">
                재설정 링크가 만료되었거나 올바르지 않아요. 다시 요청해 주세요.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 block text-body-sm text-text-dark underline"
              >
                재설정 링크 다시 받기
              </Link>
            </div>
          ) : status === "done" ? (
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClassName}
                  />
                  {isTooShort && (
                    <p className="mt-1 text-body-sm text-discount-alternate">
                      {MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.
                    </p>
                  )}
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
                    className={inputClassName}
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
                  {status === "loading" ? "변경 중..." : "비밀번호 변경"}
                </button>
                {status === "error" && (
                  <p role="alert" className="text-body-sm text-discount-alternate">
                    {errorMessage}
                  </p>
                )}
              </form>
            </>
          )}
          <Link
            href="/"
            className="mt-6 block text-center text-body-sm text-text-secondary hover:text-text-dark"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
