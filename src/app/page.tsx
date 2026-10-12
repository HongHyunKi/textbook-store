import { Banner } from "@/shared/components/layout/Banner";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { ProductList } from "@/features/products";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <h1 className="sr-only">히든카이스 스토어</h1>
        <Banner />
        <section className="mx-auto w-full max-w-[1240px] px-4 py-[50px] md:px-6">
          <h2 className="sr-only">교재 목록</h2>
          <ProductList />
        </section>
      </main>
      <Footer />
    </>
  );
}
