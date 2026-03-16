import type { Metadata } from "next";

export const metadata: Metadata = { title: "О компании — Техно online" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">О компании</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-[var(--color-text-muted)]">
        <p>
          <strong className="text-[var(--color-text)]">Техно online</strong> —
          это интернет-магазин качественной бытовой техники от ведущих мировых
          производителей.
        </p>
        <p>
          Мы работаем на рынке бытовой техники и стремимся предоставить нашим
          клиентам лучший выбор товаров по выгодным ценам с гарантией качества и
          профессиональным сервисным обслуживанием.
        </p>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          Наши преимущества
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Широкий ассортимент товаров</li>
          <li>Только оригинальная продукция</li>
          <li>Официальная гарантия производителя</li>
          <li>Быстрая доставка по всей России</li>
          <li>Удобные способы оплаты</li>
          <li>Профессиональная консультация</li>
        </ul>
      </div>
    </div>
  );
}
