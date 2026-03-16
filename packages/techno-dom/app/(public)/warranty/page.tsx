import type { Metadata } from "next";

export const metadata: Metadata = { title: "Гарантия — Техно online" };

export default function WarrantyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Гарантия</h1>
      <div className="space-y-4 text-[var(--color-text-muted)]">
        <p>
          На всю технику, представленную в нашем магазине, распространяется
          официальная гарантия производителя.
        </p>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          Условия гарантии
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Гарантийный срок указан в карточке каждого товара</li>
          <li>Гарантия действует с момента покупки</li>
          <li>Для обращения по гарантии необходим чек или электронный заказ</li>
          <li>Гарантия не распространяется на механические повреждения</li>
        </ul>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          Возврат и обмен
        </h2>
        <p>
          Возврат товара надлежащего качества возможен в течение 14 дней с
          момента покупки при сохранении товарного вида и упаковки.
        </p>
      </div>
    </div>
  );
}
