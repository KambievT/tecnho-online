import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductGallery from "@/components/ui/ProductGallery";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Truck, ShieldCheck, Phone, Package, ChevronRight } from "lucide-react";

import { getApiUrl } from "@/lib/api";

const API = getApiUrl();

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — Техно online`,
    description: product.description || `Купить ${product.name} в Техно online`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const discount = product.oldPrice
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100,
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6 flex-wrap">
        <Link
          href="/"
          className="hover:text-[var(--color-text)] transition-colors"
        >
          Главная
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href="/catalog"
          className="hover:text-[var(--color-text)] transition-colors"
        >
          Каталог
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/catalog?category=${product.category.id}`}
              className="hover:text-[var(--color-text)] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-text)] font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <ProductGallery
            images={product.images}
            productName={product.name}
            discount={discount}
          />
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/catalog?category=${product.category.id}`}
              className="inline-block text-sm text-[var(--color-primary)] bg-blue-50 px-3 py-1 rounded-full font-medium mb-3 hover:bg-blue-100 transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-[var(--color-text)]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-[var(--color-text-muted)] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full" />В наличии
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Нет в наличии
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <AddToCartButton product={product} />
            <a
              href="tel:+70000000000"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
            <ButtonLink
              href="/feedback"
              variant="outline"
              size="lg"
              className="rounded-xl"
            >
              Написать нам
            </ButtonLink>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-muted)] rounded-xl">
              <Truck className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <div>
                <p className="text-xs font-medium">Доставка</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  по СПб и ЛО
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-muted)] rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <div>
                <p className="text-xs font-medium">Гарантия</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  до 12 месяцев
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-muted)] rounded-xl">
              <Package className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <div>
                <p className="text-xs font-medium">Установка</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  подключение
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-base mb-3">Описание</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Filter values / Specs */}
          {product.filterValues && product.filterValues.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="font-semibold mb-4">Характеристики</h3>
              <dl className="space-y-0">
                {product.filterValues.map((fv, i) => (
                  <div
                    key={fv.filterValue.id}
                    className={`flex justify-between text-sm py-3 ${
                      i % 2 === 0 ? "bg-[var(--color-bg-muted)]" : ""
                    } px-3 rounded-lg`}
                  >
                    <dt className="text-[var(--color-text-muted)]">
                      {fv.filterValue.filter.name}
                    </dt>
                    <dd className="font-medium">{fv.filterValue.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
