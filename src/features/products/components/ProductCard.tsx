import Image from "next/image";
import { CATEGORY_LABEL, type Product } from "../types";

const priceFormat = new Intl.NumberFormat("ko-KR");

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount_rate !== null && product.discount_rate > 0;

  return (
    <article className="min-w-0">
      <div className="relative aspect-[250/320] overflow-hidden rounded-base border border-border-default bg-background">
        <Image
          src={/^\/(?!\/)/.test(product.image_url) ? product.image_url : "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(min-width:1280px) 250px, (min-width:768px) 33vw, 50vw"
          className="object-contain"
        />
      </div>
      <p className="mt-1 text-body text-text-secondary">{CATEGORY_LABEL[product.category]}</p>
      {/* 카드 높이를 상품마다 같게 맞춰 페이지 이동 시 그리드 높이가 바뀌지 않게 한다.
          xl은 피그마처럼 한 줄(말줄임), 그보다 좁으면 두 줄 높이를 고정한다. */}
      <h3
        title={product.title}
        className="line-clamp-2 min-h-[2lh] break-words text-body text-text-primary xl:line-clamp-1 xl:min-h-0"
      >
        {product.title}
      </h3>
      <div className="mt-2 text-body">
        {/* 할인이 없어도 원가 줄 높이를 비워 둔다 */}
        <p className="min-h-[1lh] text-body-sm text-text-muted">
          {hasDiscount && product.original_price !== null && (
            <del>{priceFormat.format(product.original_price)}원</del>
          )}
        </p>
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          {hasDiscount && <span className="text-discount">{product.discount_rate}%</span>}
          <span>{priceFormat.format(product.price)}원</span>
        </p>
      </div>
    </article>
  );
}
