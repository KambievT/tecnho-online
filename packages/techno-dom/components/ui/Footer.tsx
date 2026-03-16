import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-muted)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-[var(--color-text)] text-lg mb-2">
            ТехноOnline
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Магазин бытовой техники с доставкой по всей России
          </p>
        </div>

        {/* Catalog */}
        <div>
          <h3 className="font-semibold text-[var(--color-text)] mb-3">
            Каталог
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li>
              <Link
                href="/catalog"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Холодильники
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Стиральные машины
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Телевизоры
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Пылесосы
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-[var(--color-text)] mb-3">
            Информация
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li>
              <Link
                href="/delivery"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Доставка и оплата
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Новости
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-[var(--color-text)] mb-3">
            Поддержка
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li>
              <Link
                href="/contacts"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Контакты
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Техно online. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
