import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Техно online",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Политика конфиденциальности</h1>
      <div className="space-y-4 text-[var(--color-text-muted)] text-sm leading-relaxed">
        <p>
          Настоящая политика конфиденциальности определяет порядок обработки и
          защиты персональных данных пользователей сайта Техно online.
        </p>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Сбор информации
        </h2>
        <p>
          Мы собираем информацию, которую вы предоставляете при оформлении
          заказа или обращении через форму обратной связи: имя, email, номер
          телефона.
        </p>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Использование
        </h2>
        <p>
          Полученная информация используется исключительно для обработки
          заказов, доставки товаров и связи с клиентами.
        </p>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Защита данных
        </h2>
        <p>
          Мы принимаем необходимые меры для защиты ваших персональных данных от
          несанкционированного доступа, изменения или уничтожения.
        </p>
      </div>
    </div>
  );
}
