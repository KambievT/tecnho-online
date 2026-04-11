"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import CartSheet from "./CartSheet";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/providers/cart-provider";

const NAV = [
  {
    label: "Главная",
    href: "/",
    sections: [
      { label: "Баннер", anchor: "#banner" },
      { label: "Каталог", anchor: "#catalog" },
      { label: "О компании", anchor: "#about" },
      { label: "Вопросы и ответы", anchor: "#faq" },
      { label: "Связаться с нами", anchor: "#contact" },
    ],
  },
  {
    label: "Каталог",
    href: "/catalog",
    sections: [
      { label: "Поиск товаров", anchor: "#top" },
      { label: "Категории", anchor: "#top" },
    ],
  },
  {
    label: "Доставка и оплата",
    href: "/delivery",
    sections: [
      { label: "Услуги доставки", anchor: "#delivery-services" },
      { label: "Способы оплаты", anchor: "#payment" },
      { label: "Как это работает", anchor: "#how-it-works" },
      { label: "Контакты", anchor: "#delivery-contact" },
    ],
  },
  {
    label: "Новости",
    href: "/news",
    sections: [{ label: "Все новости", anchor: "#top" }],
  },
  {
    label: "Контакты",
    href: "/contacts",
    sections: [{ label: "Адреса магазинов", anchor: "#top" }],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] py-3">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.webp"
              alt="Техно online"
              width={120}
              height={60}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`relative inline-block px-4 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? "text-[var(--color-primary)] bg-blue-50"
                        : "text-[#5d5d5d] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Dropdown */}
                  {item.sections && item.sections.length > 0 && (
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-[var(--color-border)] py-2 min-w-[200px]">
                        {item.sections.map((sec) => {
                          const isCurrentPage =
                            item.href === "/"
                              ? pathname === "/"
                              : pathname.startsWith(item.href);
                          const href = isCurrentPage
                            ? sec.anchor
                            : `${item.href}${sec.anchor}`;
                          return (
                            <a
                              key={sec.anchor + sec.label}
                              href={href}
                              className="block px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                            >
                              {sec.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Поиск"
            >
              <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart className="w-5 h-5 text-[var(--color-text-muted)]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
