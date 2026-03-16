"use client";

import { useEffect, useRef } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSheet({ open, onClose }: CartSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

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
              0
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
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Корзина пуста</h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-[240px]">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
          </div>

          {/* Example cart item (hidden when empty, shown when products added) */}
          {/*
          <div className="space-y-4">
            <div className="flex gap-4 p-3 border border-[var(--color-border)] rounded-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Product Name</p>
                <p className="text-[var(--color-primary)] font-semibold mt-1">12 990 ₽</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="w-7 h-7 rounded border text-sm">−</button>
                  <span className="text-sm">1</span>
                  <button className="w-7 h-7 rounded border text-sm">+</button>
                </div>
              </div>
              <button className="self-start p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          */}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Итого:</span>
            <span className="text-xl font-bold">0 ₽</span>
          </div>
          <button
            disabled
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium opacity-50 cursor-not-allowed transition-opacity"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
}
