import Image from "next/image";
import { CATEGORY_LABEL, type Product } from "./types";

const priceFormat = new Intl.NumberFormat("ko-KR");

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount_rate !== null && product.discount_rate > 0;

  return (
    <article className="min-w-0">
      <div className="relative aspect-[250/320] overflow-hidden rounded-[6px] border border-line bg-white">
        <Image
          src={/^\/(?!\/)/.test(product.image_url) ? product.image_url : "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
          className="object-contain"
        />
      </div>
      <p className="mt-4 text-xs text-gray-500">{CATEGORY_LABEL[product.category]}</p>
      <h3 className="mt-1 break-words text-sm leading-6 font-medium sm:text-base">
        {product.title}
      </h3>
      <div className="mt-2 text-sm sm:text-base">
        {hasDiscount && product.original_price !== null && (
          <p className="mb-1 text-xs text-gray-400 sm:text-sm">
            <del>{priceFormat.format(product.original_price)}원</del>
          </p>
        )}
        <p className="flex flex-wrap items-baseline gap-x-2 font-bold">
          {hasDiscount && (
            <span className="text-brand-orange">{product.discount_rate}%</span>
          )}
          <span>{priceFormat.format(product.price)}원</span>
        </p>
      </div>
    </article>
  );
}
