import Link from "next/link";
import {
  ArrowRight,
  Truck,
  Wrench,
  ShieldCheck,
  BadgePercent,
  Phone,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import type { Product, Category, PaginatedResponse } from "@/types";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

const API = getApiUrl();

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products?limit=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: PaginatedResponse<Product> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        id="banner"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-white"
      >
        <ParticlesBackground />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 text-center relative z-10">
          <p className="text-[var(--color-accent)] font-semibold tracking-wide uppercase text-sm mb-4">
            Бытовая техника для дома
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-text)] leading-tight mb-6">
            Качественная техника
            <br />
            по <span className="text-[var(--color-accent)]">лучшим ценам</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto mb-8">
            Широкий выбор бытовой техники от ведущих мировых производителей.
            <br />
            Доставка по всей России, гарантия и сервисное обслуживание.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <ButtonLink href="/catalog" size="lg">
              Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ButtonLink href="/delivery" variant="outline" size="lg">
              Доставка и оплата
            </ButtonLink>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-orange-100 rounded-full opacity-50 blur-3xl animate-float-medium" />
      </section>

      {/* ——— Каталог ——— */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">
          Каталог
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8">
          Популярная бытовая техника для вашего дома
        </p>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <ButtonLink href="/catalog" variant="primary" size="sm">
              Все
            </ButtonLink>
            {categories.slice(0, 6).map((cat) => (
              <ButtonLink
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                variant="outline"
                size="sm"
              >
                {cat.name}
              </ButtonLink>
            ))}
          </div>
        )}

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            Товары появятся здесь после добавления через админ-панель.
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-8 text-center">
            <ButtonLink href="/catalog" variant="outline">
              Смотреть все товары <ArrowRight className="w-4 h-4 ml-2" />
            </ButtonLink>
          </div>
        )}
      </section>

      {/* ——— О компании ——— */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Logo card */}
          <div className="border border-[var(--color-border)] rounded-2xl p-10 flex items-center justify-center bg-white">
            <div className="text-center">
              <Image
                src="/logo.webp"
                alt="Техно online"
                width={120}
                height={60}
                className="h-44 w-auto"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2 leading-tight">
              Большой выбор бытовой техники
              <br />
              <span className="text-[var(--color-accent)]">
                б/у и с уценкой
              </span>
            </h2>
            <div className="space-y-4 mt-6 text-[var(--color-text-muted)] leading-relaxed">
              <p>
                Компания «ТехноOnline» занимается продажей бытовой техники. За
                счёт того, что у нас есть свой сервисный центр, мы можем дать
                гарантию до 12 месяцев на всю нашу технику.
              </p>
              <p>
                В каталоге нашего магазина представлено множество позиций
                известных мировых брендов. Наши продавцы проконсультируют вас и
                подберут наилучший вариант по вашим пожеланиям и бюджету.
              </p>
            </div>
          </div>
        </div>

        {/* 4 feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold mb-1">Быстрая доставка</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Доставка по г. Санкт-Петербург и Ленобласти
            </p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold mb-1">Установка и подключение</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Исключительно опытными мастерами
            </p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold mb-1">Гарантия до 12 месяцев</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Собственный сервисный центр
            </p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <BadgePercent className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold mb-1">Лучшие цены</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Б/у и с уценкой по выгодной цене
            </p>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-2">
          Часто задаваемые вопросы
        </h2>
        <p className="text-center text-[var(--color-text-muted)] mb-8">
          Ответы на популярные вопросы наших покупателей
        </p>

        <div className="space-y-3">
          <details className="group border border-[var(--color-border)] rounded-xl bg-white">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-medium text-[var(--color-text)] select-none">
              Почему стоит купить бытовую технику у нас?
              <svg
                className="w-5 h-5 text-[var(--color-text-muted)] shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
              У нас собственный сервисный центр, поэтому мы даём гарантию до 12
              месяцев на всю технику. Мы тщательно проверяем каждый товар перед
              продажей и предлагаем лучшие цены на рынке.
            </div>
          </details>

          <details className="group border border-[var(--color-border)] rounded-xl bg-white">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-medium text-[var(--color-text)] select-none">
              Почему в магазине такие низкие цены?
              <svg
                className="w-5 h-5 text-[var(--color-text-muted)] shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
              Мы работаем с б/у техникой и уценёнными товарами, которые прошли
              полную диагностику и ремонт в нашем сервисном центре. Это
              позволяет предложить качественную технику по значительно более
              низкой цене.
            </div>
          </details>

          <details className="group border border-[var(--color-border)] rounded-xl bg-white">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-medium text-[var(--color-text)] select-none">
              Как сделать заказ?
              <svg
                className="w-5 h-5 text-[var(--color-text-muted)] shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
              Выберите товар в каталоге и свяжитесь с нами по телефону или через
              форму обратной связи. Наши менеджеры помогут оформить заказ,
              подберут удобное время доставки и ответят на все вопросы.
            </div>
          </details>
        </div>
      </section>

      {/* ——— CTA Banner ——— */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[var(--color-primary)] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Нужна бытовая техника?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Позвоните нам или загляните в каталог — поможем подобрать лучший
            вариант по вашему бюджету.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="tel:+70000000000"
              className="inline-flex items-center gap-2 h-12 px-6 bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Phone className="w-4 h-4" /> Позвонить
            </a>
            <ButtonLink
              href="/catalog"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
            </ButtonLink>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      </section>
    </>
  );
}
