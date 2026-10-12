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
          sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
          className="object-contain"
        />
      </div>
      <p className="mt-4 text-body-sm text-text-secondary">{CATEGORY_LABEL[product.category]}</p>
      <h3 className="mt-1 break-words text-body-sm-strong text-text-primary sm:text-body">
        {product.title}
      </h3>
      <div className="mt-2 text-body-sm-strong sm:text-body">
        {hasDiscount && product.original_price !== null && (
          <p className="mb-1 text-body-sm text-text-muted">
            <del>{priceFormat.format(product.original_price)}원</del>
          </p>
        )}
        <p className="flex flex-wrap items-baseline gap-x-2">
          {hasDiscount && <span className="text-discount">{product.discount_rate}%</span>}
          <span>{priceFormat.format(product.price)}원</span>
        </p>
      </div>
    </article>
  );
}
