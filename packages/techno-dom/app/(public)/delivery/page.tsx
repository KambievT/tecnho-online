import type { Metadata } from "next";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ArrowUpFromLine,
  Wrench,
  Banknote,
  CreditCard,
  Building2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = { title: "Доставка и оплата — Техно online" };

export default function DeliveryPage() {
  return (
    <div>
      {/* Hero */}
      <section
        id="delivery-hero"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-16 md:py-24"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl animate-float-medium" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary)] text-white mb-6 animate-float-fast">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Доставка и оплата
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto mb-8">
            Доставляем технику по г. Санкт-Петербург и Ленинградской области.
            Подъём на этаж, подключение и установка.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              СПб и ЛО
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              1–3 дня
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[var(--color-primary)]" />
              Расчёт по звонку
            </span>
          </div>
        </div>
      </section>

      {/* Услуги доставки */}
      <section id="delivery-services" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Услуги доставки
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Доставка по СПб</h3>
              <p className="text-[var(--color-primary)] font-bold text-lg mb-2">
                1 200 ₽
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Доставим в удобное для вас время по Санкт-Петербургу
              </p>
            </div>

            <div className="border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <ArrowUpFromLine className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Подъём на этаж</h3>
              <p className="text-[var(--color-primary)] font-bold text-lg mb-2">
                800 ₽
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Поднимем технику до квартиры на любой этаж
              </p>
            </div>

            <div className="border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Установка</h3>
              <p className="text-[var(--color-primary)] font-bold text-lg mb-2">
                По договорённости
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Профессиональное подключение опытными мастерами
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Способы оплаты */}
      <section id="payment" className="py-16 bg-[var(--color-bg-muted)]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Способы оплаты
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Наличными</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Оплата курьеру при получении или в магазине
              </p>
            </div>

            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Банковской картой</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Visa, MasterCard, МИР — в магазине
              </p>
            </div>

            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Банковский перевод</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                Для юридических лиц и ИП по реквизитам
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
            Предоставляем товарный чек с печатью, наименованием техники и ценой.
            Также предоставляем гарантийный талон.
          </p>
        </div>
      </section>

      {/* Как это работает */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
            <h2 className="text-2xl font-bold">Как это работает</h2>
          </div>

          <div className="space-y-4">
            {[
              "Выберите товар в каталоге или позвоните нам",
              "Менеджер уточнит детали и рассчитает стоимость доставки",
              "Доставим и подключим технику в удобное время",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-[var(--color-border)] rounded-2xl p-5"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-[var(--color-text)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="delivery-contact"
        className="bg-[var(--color-bg-muted)] py-12"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Остались вопросы?</h3>
            <p className="text-[var(--color-text-muted)]">
              Менеджер рассчитает стоимость и ответит на все вопросы.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+70000000000"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
            <a
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] bg-white font-medium hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Написать
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
