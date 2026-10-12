import Image from "next/image";

// Figma 배너는 문구·아이콘·CTA가 이미지에 포함된 단일 이미지라서 이미지를 그대로 쓰고 문구는 스크린 리더용으로 둔다.
export function Banner() {
  return (
    <section aria-labelledby="banner-title" className="bg-[#0c0c0c]">
      <div className="relative mx-auto aspect-[1440/490] w-full max-w-[1440px]">
        <Image
          src="/banner/books.png"
          alt=""
          fill
          sizes="(min-width: 1440px) 1440px, 100vw"
          className="object-cover"
          preload
        />
        <div className="sr-only">
          <h2 id="banner-title">히든카이스</h2>
          <p>모두가 푸는 건 이유가 있습니다</p>
          <p>상위권이 선택한 문제집, 결과로 증명된 실전 대비서</p>
          <ul>
            <li>실전 적중: 출제 경향을 꿰뚫는 문제</li>
            <li>난이도별 구성: 단계별로 완성하는 실력</li>
            <li>검증된 결과: 합격생이 증명한 선택</li>
          </ul>
          <p>히든카이스 시리즈 보기</p>
        </div>
        <p
          aria-hidden="true"
          className="absolute bottom-[4%] right-[2%] rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-neutral-300 sm:text-xs"
        >
          <span className="text-white">1</span>/5
        </p>
      </div>
    </section>
  );
}
