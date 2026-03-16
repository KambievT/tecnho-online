"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { productService } from "@/services/products";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product, PaginatedResponse } from "@/types";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService
      .getAll({ page, limit: 20 })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  async function handleDelete(id: number) {
    if (!token || !confirm("Удалить товар?")) return;
    try {
      await productService.delete(id, token);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((p) => p.id !== id),
              total: prev.total - 1,
            }
          : prev,
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка удаления");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-4 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Добавить
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Загрузка...</p>
      ) : !data || data.data.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Товаров пока нет.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">Название</th>
                  <th className="text-left px-4 py-3 font-medium">Цена</th>
                  <th className="text-left px-4 py-3 font-medium">В наличии</th>
                  <th className="text-right px-4 py-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">
                      {product.id}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.inStock ? "text-green-600" : "text-red-500"
                        }
                      >
                        {product.inStock ? "Да" : "Нет"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-[var(--color-text-muted)]" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
