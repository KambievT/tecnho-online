import type { Metadata } from "next";
import type { Address } from "@/types";
import { getApiUrl } from "@/lib/api";

const API = getApiUrl();

export const metadata: Metadata = { title: "Контакты — Техно online" };

async function getAddresses(): Promise<Address[]> {
  try {
    const res = await fetch(`${API}/addresses`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ContactsPage() {
  const addresses = await getAddresses();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Контакты</h1>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-6"
            >
              {addr.isMain && (
                <span className="text-xs font-medium text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                  Основной адрес
                </span>
              )}
              <h3 className="font-semibold text-lg mb-2">{addr.city}</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-3">
                {addr.street}, {addr.building}
                {addr.floor && `, ${addr.floor} этаж`}
              </p>
              {addr.phone && (
                <p className="text-sm mb-1">
                  <span className="text-[var(--color-text-muted)]">Тел:</span>{" "}
                  <a
                    href={`tel:${addr.phone}`}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {addr.phone}
                  </a>
                </p>
              )}
              {addr.email && (
                <p className="text-sm">
                  <span className="text-[var(--color-text-muted)]">Email:</span>{" "}
                  <a
                    href={`mailto:${addr.email}`}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {addr.email}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[var(--color-text-muted)]">
          Адреса появятся здесь после добавления через админ-панель.
        </p>
      )}
    </div>
  );
}
