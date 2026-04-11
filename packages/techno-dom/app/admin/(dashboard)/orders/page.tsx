"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { orderService } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import type { Order, OrderStatus, PaginatedResponse } from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Новая",
  PROCESSING: "В обработке",
  COMPLETED: "Выполнена",
  CANCELLED: "Отменена",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-yellow-50 text-yellow-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-500",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    orderService
      .getAll({ page, limit: 20, status: statusFilter || undefined }, token)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter, token]);

  async function handleStatusChange(id: number, status: OrderStatus) {
    if (!token) return;
    try {
      const updated = await orderService.updateStatus(id, status, token);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((o) =>
                o.id === id ? { ...o, ...updated } : o,
              ),
            }
          : prev,
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка");
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Удалить заявку?")) return;
    try {
      await orderService.delete(id, token);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((o) => o.id !== id),
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
        <h1 className="text-2xl font-bold">Заявки</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
        >
          <option value="">Все статусы</option>
          <option value="NEW">Новые</option>
          <option value="PROCESSING">В обработке</option>
          <option value="COMPLETED">Выполненные</option>
          <option value="CANCELLED">Отменённые</option>
        </select>
      </div>

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Загрузка...</p>
      ) : !data || data.data.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">Заявок пока нет.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium">№</th>
                  <th className="text-left px-4 py-3 font-medium">Клиент</th>
                  <th className="text-left px-4 py-3 font-medium">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-right px-4 py-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3">{order.phone}</td>
                      <td className="px-4 py-3">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                        >
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === order.id ? null : order.id,
                              )
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Подробнее"
                          >
                            {expandedId === order.id ? (
                              <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr
                        key={`${order.id}-details`}
                        className="border-b border-[var(--color-border)]"
                      >
                        <td colSpan={7} className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            {order.email && (
                              <div>
                                <span className="text-[var(--color-text-muted)]">
                                  Email:{" "}
                                </span>
                                {order.email}
                              </div>
                            )}
                            {order.address && (
                              <div>
                                <span className="text-[var(--color-text-muted)]">
                                  Адрес:{" "}
                                </span>
                                {order.address}
                              </div>
                            )}
                            {order.comment && (
                              <div className="col-span-2">
                                <span className="text-[var(--color-text-muted)]">
                                  Комментарий:{" "}
                                </span>
                                {order.comment}
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium mb-2">Товары:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-[var(--color-border)]"
                              >
                                <div>
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <span className="text-[var(--color-text-muted)] ml-2">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <span className="font-medium">
                                  {formatPrice(
                                    String(Number(item.price) * item.quantity),
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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
