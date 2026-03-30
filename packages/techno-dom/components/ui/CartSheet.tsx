"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSheet({ open, onClose }: CartSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [delivery, setDelivery] = useState(0);
  const [extraOptions, setExtraOptions] = useState(0);
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const API = getApiUrl();

  const grandTotal = totalPrice + delivery + extraOptions;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold">Корзина</h2>
            <span className="text-xs bg-blue-50 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-medium">
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Корзина пуста</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-[240px]">
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, quantity }) => {
                const img = product.images?.[0];
                return (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 border border-[var(--color-border)] rounded-xl"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      {img ? (
                        <Image
                          src={
                            img.url.startsWith("http")
                              ? img.url
                              : `${API}${img.url}`
                          }
                          alt={img.alt || product.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                          📷
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-[var(--color-primary)] font-semibold text-sm mt-1">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="w-7 h-7 rounded border border-[var(--color-border)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="w-7 h-7 rounded border border-[var(--color-border)] flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="self-start p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] px-6 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-[var(--color-text-muted)] whitespace-nowrap">
              Доставка:
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                value={delivery || ""}
                onChange={(e) =>
                  setDelivery(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="0"
                className="w-32 text-right pr-7 pl-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                ₽
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-[var(--color-text-muted)] whitespace-nowrap">
              Доп.Опции:
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                value={extraOptions || ""}
                onChange={(e) =>
                  setExtraOptions(Math.max(0, Number(e.target.value) || 0))
                }
                placeholder="0"
                className="w-32 text-right pr-7 pl-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                ₽
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-[var(--color-border)] pt-3 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Итого:</span>
            <span className="text-xl font-bold">
              {grandTotal.toLocaleString("ru-RU")} ₽
            </span>
          </div>
          <button
            disabled={items.length === 0}
            className={`w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium transition-opacity ${
              items.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[var(--color-primary-dark)]"
            }`}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
}
