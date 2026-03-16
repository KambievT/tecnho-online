import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const API = getApiUrl();

  return (
    <Link
      href={`/catalog/${product.id}`}
      className="group bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <Image
            src={
              image.url.startsWith("http") ? image.url : `${API}${image.url}`
            }
            alt={image.alt || product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            📷
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            Нет в наличии
          </div>
        )}
        {product.oldPrice && (
          <div className="absolute top-2 right-2 bg-[var(--color-accent)] text-white text-xs px-2 py-1 rounded-md">
            Скидка
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-[var(--color-text)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--color-text)]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
