"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { getSupabase } from "@/shared/lib/supabase";

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState<
    "checking" | "invalid" | "idle" | "loading" | "done" | "error"
  >("checking");
  const [errorMessage, setErrorMessage] = useState("");

  // 메일 링크의 인증 정보는 Supabase 클라이언트가 URL에서 읽어 세션으로 만든다.
  // 로그인 기능이 없으므로 세션이 있으면 재설정 링크로 들어온 것으로 본다.
  useEffect(() => {
    Promise.resolve()
      .then(() => getSupabase().auth.getSession())
      .then(({ data }) => setStatus(data.session ? "idle" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, []);

  const isPasswordValid = password.length >= MIN_PASSWORD_LENGTH;
  const isPasswordMatched = password === passwordConfirm;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMessage(
        error.code === "same_password"
          ? "기존과 다른 비밀번호를 입력해 주세요."
          : "비밀번호를 변경하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      setStatus("error");
      return;
    }
    await supabase.auth.signOut();
    setStatus("done");
  }

  function renderContent() {
    if (status === "checking") return null;

    if (status === "invalid") {
      return (
        <div role="status" className="text-center">
          <h1 className="text-body-lg text-text-dark">링크가 만료됐어요</h1>
          <p className="mt-2 text-body-sm text-text-secondary">
            재설정 링크는 한 번만, 1시간 안에 쓸 수 있어요.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 flex h-[48px] items-center justify-center rounded-base bg-primary text-body text-background"
          >
            링크 다시 받기
          </Link>
        </div>
      );
    }

    if (status === "done") {
      return (
        <div role="status" className="text-center">
          <h1 className="text-body-lg text-text-dark">비밀번호를 변경했어요</h1>
          <p className="mt-2 text-body-sm text-text-secondary">새 비밀번호로 로그인해 주세요.</p>
          <Link
            href="/"
            className="mt-6 block text-body-sm text-text-secondary hover:text-text-dark"
          >
            홈으로 가기
          </Link>
        </div>
      );
    }

    return (
      <>
        <h1 className="text-body-lg text-text-dark">새 비밀번호 설정</h1>
        <p className="mt-2 text-body-sm text-text-secondary">
          새로 사용할 비밀번호를 입력해 주세요.
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
              placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
              className="mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark placeholder:text-text-secondary"
            />
            {password && !isPasswordValid && (
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
              placeholder="한 번 더 입력"
              className="mt-2 h-[42px] w-full rounded-base border border-border-secondary px-3 text-body text-text-dark placeholder:text-text-secondary"
            />
            {passwordConfirm && !isPasswordMatched && (
              <p className="mt-1 text-body-sm text-discount-alternate">
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>
          {status === "error" && (
            <p role="alert" className="text-body-sm text-discount-alternate">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={!isPasswordValid || !isPasswordMatched || status === "loading"}
            className="h-[48px] rounded-base bg-primary text-body text-background disabled:opacity-40"
          >
            {status === "loading" ? "변경하는 중..." : "비밀번호 변경"}
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 justify-center px-4 py-[80px]">
        <div className="w-full max-w-[400px]">{renderContent()}</div>
      </main>
      <Footer />
    </>
  );
}
