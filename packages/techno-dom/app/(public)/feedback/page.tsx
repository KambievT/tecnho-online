import type { Metadata } from "next";

export const metadata: Metadata = { title: "Обратная связь — Техно online" };

export default function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Обратная связь</h1>
      <p className="text-[var(--color-text-muted)] mb-8">
        Если у вас есть вопросы или предложения, свяжитесь с нами.
      </p>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full h-10 px-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Сообщение</label>
          <textarea
            rows={5}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            placeholder="Ваше сообщение..."
          />
        </div>
        <button
          type="submit"
          className="h-10 px-6 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
