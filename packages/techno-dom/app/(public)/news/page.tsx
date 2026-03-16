import type { Metadata } from "next";

export const metadata: Metadata = { title: "Новости — Техно online" };

export default function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Новости</h1>
      <p className="text-[var(--color-text-muted)]">
        Здесь скоро появятся новости компании.
      </p>
    </div>
  );
}
